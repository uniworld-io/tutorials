import React from 'react';
import { get } from 'lodash';
import {
    Pressable,
    StyleSheet,
    View,
    Image,
} from 'react-native';
import { BoldText } from '../../../components/CustomFontText/BoldText';
import { RegularText } from '../../../components/CustomFontText/RegularText';
import images from '../../../config/images';
import { blackColor, COLORS } from '../../../utils/colorHelper';
import { helpers } from '../../../utils/helpers';
import { SemiBoldText } from '../../../components/CustomFontText/SemiBoldText';
import { CONSTANTS } from '../../../config/customize';

export const FutureNativeCoinItem = ({ item }) => {
    return (
        <View
            style={styles.content}
        >
            <View style={styles.labelWrapper}>
                <Image
                    source={images.banner}
                    style={{ width: 30, height: 30 }}
                />
                <SemiBoldText style={styles.balance}>
                    {helpers.formatNumber(get(item, 'future_balance', 0)) + ' ' + CUSTOMIZE.token_name}
                </SemiBoldText>
            </View>
            <RegularText style={styles.time}>Expire: {new Date(item?.expire_time).toLocaleString()}</RegularText>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        borderBottomColor: blackColor(0.08),
        borderBottomWidth: 1,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    balance: {
        fontSize: 18,
        marginLeft: 10
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
        marginLeft: 8,
        fontSize: 14,
        color: blackColor(.7)
    }
});
