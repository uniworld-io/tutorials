import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {RegularText} from '../../../components/CustomFontText/RegularText';
import {COLORS} from '../../../utils/colorHelper';
import {BoldText} from '../../../components/CustomFontText/BoldText';
import {Icon} from 'native-base';
import { CUSTOMIZE } from '../../../config/customize';

export const BrowserHeader = ({}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <BoldText style={{fontSize: 28, color: CUSTOMIZE.primary_color, textAlign: 'left'}}>
        Browser
      </BoldText>
    </View>
  );
};

const styles = StyleSheet.create({});
