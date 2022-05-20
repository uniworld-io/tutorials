import {Icon} from 'native-base';
import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Animatable from 'react-native-animatable';
import images from '../../../config/images';
import metrics from '../../../config/metrics';
import {blackColor, whiteColor} from '../../../utils/colorHelper';
import {helpers} from '../../../utils/helpers';
import { CONSTANTS } from '../../../config/customize';

export const WalletCard = ({
  balance,
  unwAddress,
  visible = false,
  setVisible = () => {},
  style = {},
  setLockVisible = () => {},
}) => {
  return (
    <Animatable.View animation="fadeIn" style={{width: '100%'}}>
      <View style={{width: '100%', height: null}}>
        <View
          style={{
            width: metrics.screenWidth - 95,
            alignSelf: 'center',
            backgroundColor: blackColor(0.05),
            height: 15,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}></View>
        <View
          style={{
            width: metrics.screenWidth - 65,
            alignSelf: 'center',
            backgroundColor: blackColor(0.15),
            height: 20,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}></View>
        <ImageBackground
          source={images.wallet_bg}
          style={{
            flex: 1,
            width: null,
            height: null,
            borderRadius: 15,
            overflow: 'hidden',
            padding: 20,
            marginTop: -5,
          }}>
          <Text style={styles.label}>Total</Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Text style={styles.content}>
              {helpers.formatNumber(balance)}
              <Text style={{fontWeight: 'normal', fontSize: 18}}> {CUSTOMIZE.token_name}</Text>
            </Text>
            <Pressable
              onPress={() => setLockVisible(true)}
              style={{
                backgroundColor: '#CC393C',
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginLeft: 10,
                borderRadius: 8,
              }}>
              <Text style={{color: 'white', fontWeight: '600'}}>Lock</Text>
            </Pressable>
          </View>
          <Text style={[styles.label, {marginTop: 20}]}>Address</Text>
          <Text
            style={{color: 'white', fontSize: 18, marginTop: 5}}
            numberOfLines={1}>
            {unwAddress}
          </Text>
          <Pressable
            onPress={() => setVisible(true)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
            }}>
            <QRCode
              value={unwAddress ? unwAddress : ' '}
              size={35}
              color="black"
              backgroundColor="white"
            />
          </Pressable>
        </ImageBackground>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: whiteColor(0.7),
  },
  content: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
