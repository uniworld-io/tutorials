import React from 'react';
import { get } from 'lodash';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import { RegularText } from '../../../components/CustomFontText/RegularText';
import images from '../../../config/images';
import { blackColor } from '../../../utils/colorHelper';
import { SemiBoldText } from '../../../components/CustomFontText/SemiBoldText';

export const FutureTxItem = ({ item }) => {
    return (
        <View
            style={styles.content}
        >
            <View style={styles.up}>
                <View style={styles.labelWrapper}>
                    <Image
                        source={images.unwCashGr}
                        style={{ width: 30, height: 30 }}
                    />
                    <RegularText style={styles.label}>{get(item, 'token_name', '')}</RegularText>
                </View>
                <SemiBoldText style={styles.balance}>{get(item, 'future_balance', 0)}</SemiBoldText>
            </View>
            <RegularText style={styles.time}>Expire: {new Date(item?.expire_time).toLocaleString()}</RegularText>
        </View >
    );
};

const styles = StyleSheet.create({
    content: {
        marginBottom: 3,
        borderBottomColor: blackColor(0.08),
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    up: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    balance: {
        fontSize: 20
    },
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginLeft: 8
    },
    time: {
        marginLeft: 38,
        fontSize: 12,
        color: blackColor(.7)
    }
});
