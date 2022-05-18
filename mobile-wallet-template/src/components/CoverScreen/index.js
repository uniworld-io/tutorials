import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'native-base';
import {blackColor} from '../../utils/colorHelper';
import {helpers} from '../../utils/helpers';

export const CoverScreen = ({}) => {
  const view = (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: blackColor(0.2),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          padding: 20,
          borderRadius: 8,
          backgroundColor: 'grey',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 15, color: 'white'}}>Comming soon...</Text>
      </View>
    </View>
  );

  return view;
};

const styles = StyleSheet.create({
  label: {},
  content: {
    color: blackColor(0.6),
    fontSize: 13,
    marginRight: 10,
  },
});
