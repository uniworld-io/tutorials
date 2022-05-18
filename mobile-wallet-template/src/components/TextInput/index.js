import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, Textarea } from 'native-base';
import { blackColor, COLORS } from '../../utils/colorHelper';
import images from '../../config/images';
import Clipboard from '@react-native-community/clipboard';

export const useInput = ({
  isArea = false,
  isQRInput = false,
  pasted = false,
  init = '',
  active = false,
  secure = false,
  keyboardType = 'default',
  setVisible = () => { },
  style = {},
}) => {
  const [value, setValue] = useState(init);

  const navigation = useNavigation();

  let view;

  if (!isArea) {
    view = (
      <View style={{ width: '100%' }}>
        <TextInput
          value={value}
          numeric={true}
          onChangeText={(txt) => {
            // console.log(Number.isNaN(Number(txt)));
            setValue(txt);
          }}
          keyboardType={keyboardType}
          editable={active}
          secureTextEntry={secure}
          style={[
            styles.input,
            !active && { color: blackColor(0) },
            isQRInput && { paddingRight: 50 },
            style,
          ]}
          numberOfLines={1}
        />
        {isQRInput && (
          <Pressable
            onPress={() => {
              setVisible(false);
              setTimeout(() => {
                navigation.navigate('WalletScanner', { setValue, setVisible });
              }, 401);
            }}
            style={{
              position: 'absolute',
              right: 10,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={images.qrcode} style={{ width: 30, height: 30 }} />
          </Pressable>
        )}
        {pasted && (
          <Pressable
            onPress={async () => {
              const res = await Clipboard.getString();
              setValue(res);
            }}
            style={{
              position: 'absolute',
              right: 10,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name='paste'
              type='FontAwesome5'
              style={{ fontSize: 22, color: COLORS.black }}
            />
          </Pressable>
        )}
      </View>
    );
  } else {
    view = (
      <View style={styles.inputContainer}>
        <Textarea
          value={value}
          disabled={!active}
          onChangeText={(txt) => setValue(txt)}
          style={[styles.area, !active && { color: blackColor(0.4) }]}
          rowSpan={5}
        />
        {pasted && (
          <Pressable
            onPress={async () => {
              const res = await Clipboard.getString();
              setValue(res);
            }}
            style={{
              position: 'absolute',
              right: 10,
              top: 10
            }}>
            <Icon
              name='paste'
              type='FontAwesome5'
              style={{ fontSize: 22, color: COLORS.black }}
            />
          </Pressable>
        )}
      </View>
    );
  }

  return [value, setValue, view];
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: '#E1E1E1',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 26,
    color: 'black',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#E1E1E1',
    padding: 8,
    borderRadius: 26,
  },
  area: {
    padding: 0,
    color: 'black',
  },
});
