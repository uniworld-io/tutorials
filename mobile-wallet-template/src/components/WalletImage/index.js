import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import { CUSTOMIZE } from '../../config/customize';
import images from '../../config/images';
import metrics from '../../config/metrics';
import {helpers} from '../../utils/helpers';

export const WalletImage = ({style}) => {
  return (
    <View style={[styles.container, style]}>
      <Image source={CUSTOMIZE.logo} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: helpers.isTablet ? 200 : metrics.screenWidth / 3,
    height: helpers.isTablet ? 200 : metrics.screenWidth / 3,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});
