import {Icon} from 'native-base';
import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {blackColor} from '../../utils/colorHelper';

export const AppButton = ({
  text = 'GENERATE',
  disabled = false,
  handleAction = () => {},
  style = {},
  minWidth = 130,
  loading = false,
  loadingText = 'Sending',
  textStyle = {},
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        handleAction();
      }}
      style={[
        styles.container,
        {backgroundColor: disabled ? '#939393' : blackColor(1), minWidth},
        style,
      ]}>
      {loading ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ActivityIndicator animating={true} size="small" color="white" />
          <Text style={[styles.txt, textStyle, {marginLeft: 10}]}>
            {loadingText}
          </Text>
        </View>
      ) : (
        <Text style={[styles.txt, textStyle]}>{text}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    marginBottom: 16
  },
  txt: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});
