import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { BoldText } from '../../../components/CustomFontText/BoldText';

import LogoutController from '../../../components/LogoutController';
import { CONSTANTS, CUSTOMIZE } from '../../../config/customize';
import { COLORS } from '../../../utils/colorHelper';

export const WalletHeader = ({ }) => {
  return (
    <View
      style={styles.container}>
      <Image
        source={CUSTOMIZE.banner}
        style={styles.img}
      />
      <View style={styles.titleWrapper}>
        <BoldText numberOfLines={1} style={styles.title}>
          {CUSTOMIZE.banner_title}
        </BoldText>
      </View>
      <View style={styles.leftWrapper}>
        <LogoutController />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center'
  },
  img: {
    width: 45,
    height: 45,
    borderRadius: 8,
    overflow: 'hidden'
  },
  leftWrapper: {
    width: 45,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 20,
    textTransform: 'uppercase',
    color: COLORS.black
  },
  titleWrapper: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
