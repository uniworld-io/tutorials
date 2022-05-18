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
import { CONSTANTS } from '../../../config/customize';
import images from '../../../config/images';
import {blackColor, whiteColor} from '../../../utils/colorHelper';
import {helpers} from '../../../utils/helpers';

export const InfoCard = ({
  label = 'Available',
  figure = 0,
  unit = CONSTANTS.CURRENCY,
  style = {},
  lock = false,
  expire_time = false,
  setUnlockVisible = () => {},
}) => {
  return (
    <View style={{width: '100%', ...style}}>
      <ImageBackground
        source={images.wallet_bg}
        style={{
          flex: 1,
          width: null,
          height: null,
          borderRadius: 15,
          overflow: 'hidden',
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 24,
          }}>
          <Text style={styles.label}>{label}</Text>
          {lock && (
            <Pressable
              onPress={() => {
                if (Date.now() > expire_time) {
                  // handle unlock coin
                  setUnlockVisible(true);
                } else {
                  alert(
                    `${helpers.convertMiliSecToTime(
                      parseInt((expire_time - Date.now()) / 1000),
                    )} remaining to unlock!`,
                  );
                }
              }}
              style={{}}>
              <Icon
                name={'lock'}
                type="FontAwesome"
                style={{
                  fontSize: 24,
                  color: Date.now() > expire_time ? '#74BA56' : '#BB3C45',
                }} //BB3C45
              />
            </Pressable>
          )}
        </View>
        <View>
          <Text style={styles.content}>{helpers.formatNumber(figure)}</Text>
          <Text
            style={{
              ...styles.content,
              fontWeight: 'normal',
              fontSize: 15,
              marginTop: 3,
            }}>
            {unit}
          </Text>
        </View>
      </ImageBackground>
    </View>
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
    marginTop: 5,
  },
});
