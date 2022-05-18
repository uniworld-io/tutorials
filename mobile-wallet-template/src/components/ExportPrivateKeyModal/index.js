import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Keyboard,
    TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import metrics from '../../config/metrics';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { get } from 'lodash';
import { decrypt } from '../../utils/encrypt';
import { RegularText } from '../CustomFontText/RegularText';
import useCopyToClipboard from '../../hook/useCopied';
import { CUSTOMIZE } from '../../config/customize';

export const ExportPrivateKeyModal = ({
    visible,
    setVisible = () => { },
}) => {
    const dispatch = useDispatch();

    const encryptedPrivateKey = useSelector((state) =>
        get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
    );

    const [copied, setCopy] = useCopyToClipboard(3000);

    const [error, setError] = useState(null);

    const [pwd, setPwd] = useState('');
    const [privateKey, setPrivateKey] = useState(null);

    const onConfirmPwd = async () => {
        await setError(null);
        const privateKey = await decrypt(encryptedPrivateKey, pwd);
        if (privateKey) {
            setPrivateKey(privateKey);
        } else {
            setError('Your password is incorrect');
        }
    }

    useEffect(() => {
        if (!visible) {
            setError(null);
            setPrivateKey(null);
            setPwd('');
        }
    }, [visible]);

    return (
        <Modal
            isVisible={visible}
            onDismiss={setVisible}
            onBackButtonPress={() => setVisible(false)}
            onBackdropPress={() => Keyboard.dismiss()}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            backdropTransitionOutTiming={0}
            style={{
                width: metrics.screenWidth,
                height: null,
                marginBottom: 0,
                alignSelf: 'center',
                justifyContent: 'center',
            }}>

            <View
                style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 12,
                    marginHorizontal: 20,
                    overflow: 'hidden',
                    overflow: 'hidden',
                }}>
                <Text style={styles.label}>
                    Private key
                </Text>
                {!privateKey ?
                    <View>
                        <Text style={styles.txt}>
                            Type your UniWallet password
                        </Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            value={pwd}
                            onChangeText={txt => setPwd(txt)}
                        />
                        {error ?
                            <Animatable.View animation='shake'>
                                <RegularText style={styles.errorTxt}>{error}</RegularText>
                            </Animatable.View>
                            :
                            <RegularText style={{ fontSize: 12, marginTop: 5 }}> </RegularText>
                        }
                        <View style={styles.warningBox}>
                            <Text style={styles.warningTxt}>Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                            <Pressable onPress={() => { setVisible(false) }} style={styles.cancelBtn}>
                                <Text style={styles.cancelTxt}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={onConfirmPwd} style={styles.btn}>
                                <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '500' }}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                    :
                    <View>
                        <Text style={[styles.txt, { textAlign: 'left' }]}>
                            This is your private key (click to copy)
                        </Text>
                        <Pressable onPress={() => setCopy(privateKey)} style={styles.keyBox}>
                            <Text style={styles.key}>{privateKey}</Text>
                            {copied ?
                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: blackColor(.6) }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.white }}>Copied!</Text>
                                </View>
                                :
                                null
                            }
                        </Pressable>
                        <View style={[styles.warningBox, { marginVertical: 10 }]}>
                            <Text style={styles.warningTxt}>Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.</Text>
                        </View>
                        <Pressable onPress={() => setVisible(false)} style={styles.doneBtn}>
                            <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '600' }}>Done</Text>
                        </Pressable>
                    </View>
                }

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    label: {
        textAlign: 'center',
        textTransform: 'uppercase',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },
    txt: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 20,
        color: blackColor(.7)
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: blackColor(.1),
        padding: 10,
        textAlign: 'center',
        fontSize: 16,
        color: COLORS.black
    },
    btn: {
        flex: 1,
        // marginTop: 8,
        // marginBottom: 15,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        backgroundColor: CUSTOMIZE.primary_color,
        borderWidth: 1,
        borderColor: CUSTOMIZE.primary_color,
    },
    doneBtn: {
        marginTop: 8,
        marginBottom: 15,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        backgroundColor: CUSTOMIZE.primary_color
    },
    cancelBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: blackColor(.1),
        borderRadius: 20,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20
    },
    cancelTxt: {
        fontSize: 16,
        color: 'grey',
        fontWeight: '500'
    },
    errorTxt: { color: 'red', fontSize: 12, marginTop: 5, textAlign: 'center' },
    warningBox: {
        backgroundColor: '#FDF6F6',
        padding: 8,
        borderRadius: 8
    },
    warningTxt: {
        color: '#D63453',
        fontSize: 13,
        lineHeight: 22
    },
    keyBox: {
        borderWidth: 1,
        borderColor: blackColor(.15),
        padding: 12,
        borderRadius: 8,
        overflow: 'hidden'
    },
    key: {
        color: '#D63453',
        fontSize: 16,
        fontWeight: '600'
    },
});
