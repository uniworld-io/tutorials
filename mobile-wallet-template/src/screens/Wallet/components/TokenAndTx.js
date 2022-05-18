import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {RegularText} from '../../../components/CustomFontText/RegularText';
import {blackColor, COLORS} from '../../../utils/colorHelper';
import {Icon} from 'native-base';
import {helpers} from '../../../utils/helpers';
import {BoldText} from '../../../components/CustomFontText/BoldText';

export const TokenAndTx = ({
  unwAddress,
  getTransactionHistory = () => {},
  txLoading,
}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
        paddingHorizontal: 20,
        paddingTop: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <BoldText
          style={{
            fontSize: 16,
            color: COLORS.black,
          }}>
          Transactions
        </BoldText>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable
            onPress={() => getTransactionHistory()}
            disabled={txLoading}
            style={{
              height: 30,
              width: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!txLoading ? (
              <Icon
                name="cycle"
                type="Entypo"
                style={{color: '#4F4F4F', fontSize: 20}}
              />
            ) : (
              <ActivityIndicator
                animating={true}
                size="small"
                color={'#4F4F4F'}
              />
            )}
          </Pressable>
          <Pressable
            onPress={() =>
              helpers._handleLink(
                `https://explorer.unichain.world/address-detail/${unwAddress}`,
              )
            }
            style={{paddingVertical: 6, paddingLeft: 10}}>
            <RegularText style={{color: blackColor(0.8)}}>View all</RegularText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
