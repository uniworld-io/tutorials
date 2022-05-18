import {Icon} from 'native-base';
import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {blackColor} from '../../utils/colorHelper';

export const useCheckBox = ({
  init = false,
  text = 'Your private key',
  handleAction = () => {},
  style = {},
}) => {
  const [checked, setChecked] = useState(init);

  const view = (
    <Pressable
      onPress={() => {
        setChecked(!checked);
        handleAction();
      }}
      style={[styles.container, style]}>
      <View style={styles.checkbox}>
        {checked && <Icon type="Feather" name="check" style={{fontSize: 20}} />}
      </View>
      <Text style={{color: checked ? blackColor(1) : blackColor(0.4)}}>
        {text}
      </Text>
    </Pressable>
  );

  return [checked, setChecked, view];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: blackColor(0.4),
    borderRadius: 3,
    marginRight: 10,
  },
});
