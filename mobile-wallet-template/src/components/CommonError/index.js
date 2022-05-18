import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { StyleSheet } from 'react-native';
import { RegularText } from '../CustomFontText/RegularText';

export const CommonError = ({
    err,
    style = {}
}) => {
    return (
        err ? (
            <Animatable.View animation="shake" style={style}>
                <RegularText
                    style={styles.error}>
                    {err}
                </RegularText>
            </Animatable.View >
        ) : (
            <RegularText style={{ fontSize: 12, marginTop: 5, paddingLeft: 5 }}>
                {' '}
            </RegularText>
        )
    );
};

const styles = StyleSheet.create({
    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
        paddingLeft: 5,
    }
});
