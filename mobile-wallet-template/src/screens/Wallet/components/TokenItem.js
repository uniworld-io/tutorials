import { get } from 'lodash';
import { Icon } from 'native-base';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import images from '../../../config/images';
import { blackColor, whiteColor } from '../../../utils/colorHelper';
import { helpers } from '../../../utils/helpers';

export const TokenItem = ({
    data,
    border,
    future = false
}) => {
    return (
        <View style={[styles.container, border && { borderBottomWidth: 0.5, borderBottomColor: blackColor(.1) }]}>
            <Image source={images.uniToken} style={styles.img} />
            <View style={styles.content}>
                <Text style={styles.label}>{future ? get(data, 'value.token_name', '') : get(data, 'key', '')}</Text>
                <Text style={styles.amount}>{helpers.formatAmount(future ? get(data, 'value.total_value', '') : get(data, 'value', ''))}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        marginLeft: 10
    },
    img: {
        width: 32,
        height: 32,
    },
    label: {
        fontSize: 15,
        fontWeight: '600'
    },
    amount: {
        fontSize: 18,
        fontWeight: '700'
    },
});
