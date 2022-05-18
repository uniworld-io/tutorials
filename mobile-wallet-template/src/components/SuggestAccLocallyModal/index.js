import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

import metrics from '../../config/metrics';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { RegularText } from '../CustomFontText/RegularText';
import { BoldText } from '../CustomFontText/BoldText';
import { Icon } from 'native-base';
import { helpers } from '../../utils/helpers';
import { EXPLORE_URL, LOCAL_KEYS, MESSAGES } from '../../config/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalJson, saveItemLocal } from '../../utils/localStorage';
import SimpleToast from 'react-native-simple-toast';
import { find, findIndex, includes } from 'lodash';
import { CUSTOMIZE } from '../../config/customize';

export const SuggestAccLocallyModal = ({
    visible,
    setVisible = () => { },
    resetInput = () => { },
    acc = '',
}) => {

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [err, setErr] = useState('');

    const handleSaveAddress = async () => {
        await setErr('');
        try {
            const savedAcc = await getLocalJson(LOCAL_KEYS.FAV_ACC);
            // const tempArr = Object.keys(savedAcc);
            // console.log('11111', findIndex(savedAcc, { name: name }));
            if (savedAcc && findIndex(savedAcc, { name: name.toLowerCase() }) > -1) {
                await setErr(MESSAGES.EXISTING_ACC);
                return;
            } else {
                const temp = savedAcc ? [{ name: name.toLowerCase(), address: acc }, ...savedAcc] : [{ name: name.toLowerCase(), address: acc }];
                const res = await saveItemLocal(LOCAL_KEYS.FAV_ACC, temp);
                resetInput();
                setVisible(false);
                setTimeout(() => {
                    SimpleToast.showWithGravity(MESSAGES.SAVED, SimpleToast.SHORT, SimpleToast.BOTTOM);
                }, 501);
            }
        } catch (error) {
            console.log('11111', err);
        }
    }

    return (
        <Modal
            isVisible={visible}
            onDismiss={() => setVisible(false)}
            onBackButtonPress={() => { }}
            onBackdropPress={() => { }}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            backdropTransitionOutTiming={0}
            style={{
                width: metrics.screenWidth,
                height: null,
                marginBottom: 0,
                alignSelf: 'center',
                justifyContent: 'flex-end',
            }}>
            <View
                style={{ justifyContent: 'flex-end', flex: 1, }}>
                <KeyboardAvoidingView behavior={!helpers.isIOS ? undefined : "padding"} enabled>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Icon name='account-plus' type='MaterialCommunityIcons' style={{ fontSize: 40, color: CUSTOMIZE.primary_color }} />
                            <View style={{ flex: 1 }}>
                                <RegularText style={styles.headerTxt}>Do you want to save this account locally?</RegularText>
                            </View>
                        </View>
                        <View style={styles.addressBox}>
                            <RegularText style={styles.addTxt}>{acc}</RegularText>
                        </View>
                        <RegularText style={styles.txt}>With name</RegularText>
                        <TextInput
                            value={name}
                            onChangeText={txt => setName(txt)}
                            style={styles.input}
                            placeholder='Enter name'
                        />
                        {err ?
                            <Animatable.Text style={styles.err} animation={'shake'} duration={500}>{err}</Animatable.Text>
                            :
                            <Text style={styles.err}> </Text>
                        }
                        <View style={styles.btnContainer}>
                            <Pressable onPress={() => {
                                resetInput();
                                setVisible(false);
                            }} style={[styles.btn]}>
                                <RegularText style={[styles.btnTxt, { color: 'grey' }]}>Cancel</RegularText>
                            </Pressable>
                            <Pressable onPress={handleSaveAddress} style={[styles.btn, { backgroundColor: CUSTOMIZE.primary_color, borderRadius: 6 }]}>
                                <RegularText style={[styles.btnTxt, { color: COLORS.white }]}>Save</RegularText>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTxt: {
        fontSize: 15,
        marginLeft: 15
    },
    addressBox: {
        backgroundColor: 'grey',
        padding: 12,
        width: '100%',
        borderRadius: 8,
        marginTop: 15,
    },
    addTxt: {
        color: COLORS.white,
        fontSize: 17,
        textAlign: 'center',
        fontWeight: '500'
    },
    txt: {
        fontSize: 16,
        marginVertical: 12,
        color: blackColor(.7)
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: blackColor(.15),
        fontSize: 16
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 10
    },
    btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12
    },
    btnTxt: {
        fontSize: 18,
        fontWeight: '700'
    },
    err: {
        color: 'red',
        fontSize: 14,
        marginTop: 8
    },
});