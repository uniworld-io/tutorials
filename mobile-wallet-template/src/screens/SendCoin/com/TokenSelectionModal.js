import React, { useEffect, useState } from 'react'
import { FlatList, View, Image, Pressable, StyleSheet } from 'react-native'

import Modal from 'react-native-modal';
import { Icon } from 'native-base';
import metrics from '../../../config/metrics';
import { RegularText } from '../../../components/CustomFontText/RegularText';
import images from '../../../config/images';
import { BoldText } from '../../../components/CustomFontText/BoldText';
import { SemiBoldText } from '../../../components/CustomFontText/SemiBoldText';
import { helpers } from '../../../utils/helpers';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { CONSTANTS, CUSTOMIZE } from '../../../config/customize';

export const TokenSelectionModal = ({
    visible,
    setVisible = () => { },
    onSelect = () => { }
}) => {

    const walletResource = useSelector((state) =>
        get(state, 'walletReducer.walletResource', null),
    );

    const [listAsset, setListAsset] = useState([]);

    useEffect(() => {
        const tempData = [...get(walletResource, 'token', [])].filter(item => item.key === CUSTOMIZE.token_name);
        setListAsset(tempData);
    }, [walletResource.token]);

    return (
        <Modal
            isVisible={visible}
            onDismiss={() => {
                setVisible(false);
            }}
            onBackButtonPress={() => {
                setVisible(false);
            }}
            onBackdropPress={() => {
                setVisible(false);
            }}
            useNativeDriver={true}
            avoidKeyboard={true}
            style={{
                width: metrics.screenWidth,
                height: null,
                marginBottom: 0,
                alignSelf: 'center',
                justifyContent: 'flex-end',
            }}>
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 8,
                    overflow: 'hidden',
                    paddingBottom: 40
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <RegularText style={styles.title}>Choose your currency</RegularText>
                    <Pressable
                        onPress={() => setVisible(false)}
                    >
                        <Icon
                            name='close'
                            style={{ fontSize: 24, color: 'grey' }}
                        />
                    </Pressable>
                </View>
                {listAsset.map((item, idx) => {
                    return (
                        <AssetItem
                            key={idx + 'asset_item'}
                            data={item}
                            onPress={() => {
                                onSelect(item);
                                setVisible(false);
                            }}
                        />
                    );
                })}
            </View>
        </Modal>
    );
}

const AssetItem = ({
    data,
    onPress
}) => {

    return (
        <Pressable
            onPress={onPress}
            style={styles.currencyContainer}>
            <Image
                source={get(data, 'key', '') === CUSTOMIZE.token_name ? CUSTOMIZE.token_icon : images.otherToken}
                style={{ width: 28, height: 28, borderRadius: 6 }}
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginLeft: 5,
                }}>
                <BoldText style={{ fontSize: 14 }}>{get(data, 'key', '')}</BoldText>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <SemiBoldText style={{ marginHorizontal: 4, fontSize: 16 }}>
                        {data?.key === 'UNW' ? helpers.formatAmount(helpers.formatUnw(get(data, 'value', 0)), 6) : data?.value}
                    </SemiBoldText>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    currencyContainer: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#CFCFCF'
    },
    title: {
        fontSize: 15,
        marginBottom: 10
    },
});