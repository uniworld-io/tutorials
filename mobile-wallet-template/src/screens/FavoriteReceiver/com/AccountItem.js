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
import { Icon } from 'native-base';

export const AccountItem = ({
    name = '',
    address = '',
    handleFavorite = () => { },
    handleSelect = () => { }
}) => {
    return (
        <Pressable
            onPress={handleSelect}
            style={styles.content}
        >
            <View style={{ flex: 1 }}>
                <RegularText style={styles.name}>{name}</RegularText>
                <RegularText style={styles.address}>{address}</RegularText>
            </View>
            {/* <Pressable onPress={handleFavorite}>
                <Icon name='star-border' type='MaterialIcons' style={{ fontSize: 30 }} />
            </Pressable> */}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    content: {
        borderBottomColor: blackColor(0.08),
        borderBottomWidth: 1,
        paddingVertical: 10,
        width: '100%',
        paddingHorizontal: 15,
        flexDirection: 'row'
    },
    name: {
        fontSize: 20,
        fontWeight: '500'
    },
    address: {
        color: blackColor(.7),
        fontSize: 16,
        marginTop: 8
    },
});
