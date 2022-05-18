import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'native-base';
import {blackColor} from '../../utils/colorHelper';
import { helpers } from '../../utils/helpers';
import { CONSTANTS } from '../../config/customize';

export const WalletInfo = ({
  label = `Your ${CONSTANTS.CURRENCY}'s Wallet Address`,
  content = '',
  numberOfLines = 1,
  style = {},
}) => {

  const view = (
    <View style={{width: '100%', marginTop: 15, ...style}}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: numberOfLines > 1 ? 9 : 0,
        }}>
        <View style={{flex: 1}}>
          <Text numberOfLines={numberOfLines} style={styles.content}>
            {content}
          </Text>
        </View>
        <Pressable
          onPress={() => helpers.handleCopyToClipboard(content)}
          style={{
            width: 34,
            height: 34,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: blackColor(0.1),
          }}>
          <Icon
            type="MaterialCommunityIcons"
            name="content-copy"
            style={{fontSize: 18, color: 'black'}}
          />
        </Pressable>
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
