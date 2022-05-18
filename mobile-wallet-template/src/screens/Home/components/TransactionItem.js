import {get} from 'lodash';
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
import metrics from '../../../config/metrics';
import {blackColor, whiteColor} from '../../../utils/colorHelper';
import {helpers} from '../../../utils/helpers';

const mapContractColors = (type) => {
  switch (type) {
    case 'FreezeBalanceContract':
      return {icon: 'lock', type: 'FontAwesome', color: '#CC393C'};
    case 'UnfreezeBalanceContract':
      return {icon: 'unlock-alt', type: 'FontAwesome', color: '#74BA56'};
    default:
      return {icon: 'exchange', type: 'FontAwesome', color: '#9E9E9E'};
  }
};

export const TransactionItem = ({index = 0, item, style = {}, unwAddress}) => {
  return (
    <Pressable
      onPress={() =>
        helpers._handleLink(
          `https://explorer.unichain.world/transaction/${item.txHash}`,
        )
      }
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        backgroundColor: index % 2 ? '#F5F5F5' : '#DCDCDC',
        ...style,
      }}>
      <View
        style={{
          height: '100%',
          width: 3,
          backgroundColor:
            get(item, 'type', 'TransferContract') == 'TransferContract'
              ? get(item, 'send', false)
                ? '#CC393C' //  74BA56
                : '#4EA550'
              : '#9E9E9E',
        }}
      />
      <View
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          name={mapContractColors(get(item, 'type', '')).icon}
          type={mapContractColors(get(item, 'type', '')).type}
          style={{
            color: mapContractColors(get(item, 'type', '')).color,
            fontSize: 16,
          }}
        />
      </View>
      <View style={{flex: 1, marginRight: 20, paddingVertical: 14}}>
        <Text numberOfLines={1} style={styles.address}>
          {get(item, 'txHash', '')}
        </Text>
      </View>
      <View style={{padding: 12}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color:
              get(item, 'type', 'TransferContract') == 'TransferContract'
                ? get(item, 'send', false)
                  ? '#CC393C'
                  : '#4EA550'
                : 'black',
          }}>
          {get(item, 'type', 'TransferContract') == 'TransferContract'
            ? get(item, 'send', false)
              ? '-'
              : '+'
            : ''}
          {helpers.formatNumber(get(item, 'amount', 0))}
        </Text>
      </View>
      <View style={{padding: 12}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: 'black',
          }}>
          {get(item, 'token', CONSTANTS.CURRENCY)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  address: {
    color: blackColor(0.7),
  },
  content: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 5,
  },
});
