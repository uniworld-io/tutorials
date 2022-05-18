import React from 'react';
import { View, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';

import metrics from '../../config/metrics';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { RegularText } from '../CustomFontText/RegularText';
import { BoldText } from '../CustomFontText/BoldText';
import { Icon } from 'native-base';
import { helpers } from '../../utils/helpers';
import { CONTRACT_TYPE_MAPPING, EXPLORE_URL } from '../../config/constants';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

export const TransactionDetailModal = ({
    visible,
    onDismiss = () => { },
}) => {

    // const tempData = {
    //     amount: 0,
    //     blockId: "00000000011414c01eb62a332fb6d7bbd54ea851082ad93ec87ff1fe0db5dab1",
    //     blockNumber: 18093248,
    //     contract_address: "UegQUsGzzBLaxZbk5XeBddPMtobAgZv99Y",
    //     create_date: "2022-04-25T08:09:26.808Z",
    //     data: "",
    //     fee: 256,
    //     from_address: "UegQUsGzzBLaxZbk5XeBddPMtobAgZv99Y",
    //     from_address_hex: "44b72574541aa85d854959c2a4e81cacf20f6220f9",
    //     method: "",
    //     raw_data: "{\"token_name\":\"CENT\",\"owner_address\":\"44b72574541aa85d854959c2a4e81cacf20f6220f9\"}",
    //     status: "SUCCESS",
    //     timestamp: 1650874166808,
    //     token_name: "CENT",
    //     txID: "4b1f541082bbcd4d615f72da9ba0b558ead2259c5de2bc7473ccafb3d4f8d27c",
    //     type: "WithdrawFutureTokenContract",
    //     __v: 0,
    //     _id: "62665743ad6f0c225384b2f1",
    // }

    const unwAddress = useSelector((state) =>
        get(state, 'walletReducer.walletInfo.unwAddress', null),
    );

    const handleNavigation = () => {
        helpers._handleLink(`${EXPLORE_URL}${visible?.txHash}`);
    }

    return (
        <Modal
            isVisible={visible ? true : false}
            onDismiss={onDismiss}
            onBackButtonPress={onDismiss}
            onBackdropPress={onDismiss}
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
            <KeyboardAvoidingView behavior={!helpers.isIOS ? undefined : "padding"} enabled>
                <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <BoldText style={{ fontSize: 20, color: COLORS.black }}>
                                Transaction Detail
                            </BoldText>
                            <Pressable onPress={onDismiss}>
                                <Icon
                                    name="ios-close"
                                    style={{ color: blackColor(0.4), fontSize: 26 }}
                                />
                            </Pressable>
                        </View>

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 14 }}>
                                <RegularText style={styles.label}>From:</RegularText>
                                <RegularText numberOfLines={1} ellipsizeMode='middle' style={styles.text}>
                                    {get(visible, 'from_address', '')}
                                </RegularText>
                            </View>
                            <View style={{ flex: 1 }}>
                                <RegularText style={styles.label}>To:</RegularText>
                                <RegularText numberOfLines={1} ellipsizeMode='middle' style={styles.text}>
                                    {
                                        get(visible, 'type', '') === 'FutureWithdrawContract'
                                            || get(visible, 'type', '') === 'WithdrawFutureTokenContract'
                                            ?
                                            get(visible, 'from_address', '')
                                            :
                                            get(visible, 'to_address', `URC-30 ${String(get(visible, 'token', '')).toUpperCase()} Pool`)
                                    }
                                </RegularText>
                            </View>
                        </View>
                        {/* row 2 */}
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 14 }}>
                                <RegularText style={styles.label}>Amount:</RegularText>
                                <RegularText style={[styles.text, {
                                    color: visible?.to_address ?
                                        get(visible, 'from_address', '') === unwAddress
                                            ? visible?.from_address === visible?.to_address ? '#4EA550' : '#EA3424'
                                            : '#4EA550'
                                        :
                                        COLORS.black
                                }]}>
                                    {
                                        visible?.to_address ?
                                            get(visible, 'from_address', '') === unwAddress
                                                ? visible?.from_address === visible?.to_address ? '+' : '-'
                                                : '+'
                                            :
                                            ''
                                    }
                                    {visible?.token === CONSTANTS.CURRENCY ?
                                        helpers.formatCurrency(helpers.formatNumber(get(visible, 'amount', 0)))
                                        :
                                        helpers.formatCurrency(get(visible, 'amount', 0))
                                    } {get(visible, 'token', CONSTANTS.CURRENCY)}
                                </RegularText>
                            </View>
                            <View style={{ flex: 1 }}>
                                <RegularText style={styles.label}>Type:</RegularText>
                                <RegularText numberOfLines={1} style={styles.text}>
                                    {CONTRACT_TYPE_MAPPING[get(visible, 'type', '')]}
                                </RegularText>
                            </View>
                        </View>

                        {/* row3 */}
                        <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
                            <RegularText style={styles.label}>Time:</RegularText>
                            <RegularText style={styles.text}>
                                {helpers.getDateFromEpochTime(get(visible, 'time', '0'))}
                            </RegularText>
                        </View>

                        {/* row4 */}
                        <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
                            <RegularText style={styles.label}>Tx Hash:</RegularText>
                            <Pressable onPress={() => helpers.handleCopyToClipboard(visible?.txHash)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RegularText numberOfLines={1} ellipsizeMode='middle' style={[styles.text, { flex: 1 }]}>
                                    {get(visible, 'txHash', '')}
                                </RegularText>
                                <Icon
                                    name='copy1'
                                    type='AntDesign'
                                    style={{ fontSize: 18, color: COLORS.black }}
                                />
                            </Pressable>
                        </View>

                        <Pressable
                            onPress={handleNavigation}
                            style={styles.confirmBtn}
                        >
                            <BoldText style={{ color: COLORS.white, fontSize: 16 }}>
                                View on UniScan
                            </BoldText>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: blackColor(.1),
        paddingBottom: 15,
        paddingHorizontal: 20
    },
    confirmBtn: {
        backgroundColor: CUSTOMIZE.primary_color,
        paddingHorizontal: 60,
        paddingVertical: 12,
        borderRadius: 16,
        marginTop: 30,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    content: {
        backgroundColor: COLORS.white,
        paddingTop: 25,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 20
    },
    label: {
        fontSize: 12,
        color: blackColor(.7)
    },
    text: {
        fontSize: 15,
        marginTop: 5,
        fontWeight: '500'
    },
    closeBtn: {
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 5
    },
    closeTxt: {
        color: blackColor(.6),
        textDecorationLine: 'underline',
        fontSize: 16
    },
});