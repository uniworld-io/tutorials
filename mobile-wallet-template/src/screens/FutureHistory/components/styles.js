import React from 'react'
import { StyleSheet } from 'react-native';
import { CUSTOMIZE } from '../../../config/customize';
import { blackColor, COLORS } from '../../../utils/colorHelper';

export const styles = StyleSheet.create({
    transaction: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAll: {
        color: blackColor(0.7),
    },
    btn: {
        alignSelf: 'center',
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2
    },
    claimBtn: {
        alignSelf: 'baseline',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: CUSTOMIZE.primary_color,
    },
    claimTxt: {
        fontSize: 14,
        color: COLORS.white
    },

    selectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 1,
        paddingHorizontal: 15,
        borderWidth: 1, 
        borderColor: blackColor(.1),
        borderRadius: 8
    }
});