import React, { useState } from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import images from '../../../config/images';
import metrics from '../../../config/metrics';
import { RegularText } from '../../../components/CustomFontText/RegularText';
import { COLORS } from '../../../utils/colorHelper';
import { BoldText } from '../../../components/CustomFontText/BoldText';
import { SemiBoldText } from '../../../components/CustomFontText/SemiBoldText';
import { useDispatch, useSelector } from 'react-redux';
import { helpers } from '../../../utils/helpers';
import { get } from 'lodash';
import { TokenItem } from './TokenItem';
import { CONSTANTS, CUSTOMIZE } from '../../../config/customize';

const ITEM_WIDTH = (metrics.screenWidth - 130) / 4;

export const ActionPanel = ({
  navigation,
  getTransactionHistory = () => { },
  setRewardModal = () => { },
}) => {
  const dispatch = useDispatch();

  const walletResource = useSelector((state) =>
    get(state, 'walletReducer.walletResource', null),
  );

  return (
    <View
      style={{
        backgroundColor: '#F5F5F5',
        paddingBottom: 60,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          width: '100%',
        }}>
        <Pressable
          onPress={() =>
            navigation.navigate('SendCoin', { getTransactionHistory })
          }
          style={styles.btnWrapper}>
          <Image
            source={images.send}
            style={styles.btn}
          />
          <RegularText style={styles.txtBtn}>Send</RegularText>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('WalletCodeInfo')}
          style={[styles.btnWrapper, { marginRight: 0 }]}>
          <Image
            source={images.receive}
            style={styles.btn}
          />
          <RegularText style={styles.txtBtn}>Receive</RegularText>
        </Pressable>
      </View>
      {get(walletResource, 'token_future', []).length > 0 &&
        <View
          style={styles.tokenWrapper}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <RegularText style={{ fontSize: 13 }}>Future Tokens</RegularText>
              <Pressable
                onPress={() => {
                  navigation.navigate('FutureHistory');
                }}
                style={styles.claimBtn}>
                <SemiBoldText style={{ color: COLORS.white, fontSize: 15 }}>
                  Claim
                </SemiBoldText>
              </Pressable>
            </View>
            {get(walletResource, 'token_future', []).map((item, idx) => {
              return <TokenItem
                key={idx + 'token_future'}
                data={item}
                future={true}
                border={idx !== walletResource?.token_future?.length - 1}
              />
            })}
          </View>
        </View>
      }

      <View
        style={[styles.tokenWrapper, { paddingBottom: 15 }]}>
        <View style={{ flex: 1 }}>
          <RegularText style={{ fontSize: 13 }}>Rewards</RegularText>
          <BoldText style={{ fontSize: 20, marginTop: 6 }}>
            {get(walletResource, 'reward', 0)
              ? helpers.formatAmount(helpers.formatUnw(get(walletResource, 'reward', 0)), 6)
              : 0}{' '}
            {CUSTOMIZE.token_name}
          </BoldText>
        </View>
        <Pressable
          disabled={get(walletResource, 'reward', 0) == 0}
          onPress={() => {
            setRewardModal(true);
          }}
          style={[styles.withdrawBtn, {
            backgroundColor:
              get(walletResource, 'reward', 0) == 0 ? '#4C4C4C' : CUSTOMIZE.primary_color,
          }]}>
          <SemiBoldText style={{ color: COLORS.white, fontSize: 15 }}>
            Withdraw
          </SemiBoldText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    alignItems: 'center',
    marginRight: 30,
    width: ITEM_WIDTH
  },
  btn: {
    width: ITEM_WIDTH - 10,
    height: ITEM_WIDTH - 10,
    borderRadius: 100
  },
  txtBtn: {
    fontSize: 13,
    marginTop: 5
  },
  tokenWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 15,
    paddingBottom: 5
  },
  claimBtn: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: CUSTOMIZE.primary_color,
    borderRadius: 20,
  },
  withdrawBtn: {
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderRadius: 20,
  }
});