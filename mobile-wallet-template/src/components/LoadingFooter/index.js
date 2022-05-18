import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { COLORS } from '../../utils/colorHelper';
import { RegularText } from '../CustomFontText/RegularText';

export const ListFooterComponent = () => (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10
    }}>
        <ActivityIndicator
            size='small'
            color={COLORS.grey}
            animating={true}
        />
        <RegularText
            style={{
                fontSize: 16,
                textAlign: 'center',
                marginLeft: 5,
                color: COLORS.grey
            }}
        >
            Loading...
        </RegularText>
    </View>
);