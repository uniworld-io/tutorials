import React from 'react'
import { View, Image } from 'react-native'
import images from '../../config/images'
import { RegularText } from '../CustomFontText/RegularText'

export const EmptyView = () => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
                source={images.empty}
                style={{ width: 110, height: 110, resizeMode: 'contain' }}
            />
            <RegularText
                style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    color: '#A4A4A4',
                    marginTop: 15,
                }}>
                No data available
            </RegularText>
        </View>
    );
}