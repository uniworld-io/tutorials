import React, { useState, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';

import metrics from '../../config/metrics';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { RegularText } from '../CustomFontText/RegularText';
import { BoldText } from '../CustomFontText/BoldText';
import { Icon } from 'native-base';
import { helpers } from '../../utils/helpers';
import { get, isInteger } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  PWD_MODAL_LOADING_DISABLE,
  REQUEST_GET_ACCOUNT_RESOURCE,
  PWD_MODAL_LOADING_ENABLE,
  TX_STATUS_MODAL_SHOW,
  TX_STATUS_MODAL_SHOW_ERROR,
} from '../../redux/actions/types';
import { SemiBoldText } from '../CustomFontText/SemiBoldText';
import {
  ACTION_TOKEN_BY_NATIVE_UNW,
  MESSAGES,
  TOKEN_ACTIONS,
} from '../../config/constants';
import { decrypt } from '../../utils/encrypt';
import { handleActionToken } from '../../redux/services/unw';
import { getTokenDetail } from '../../redux/services/token';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

const TITLE_TOKEN_TYPE_MAPPING = {
  [TOKEN_ACTIONS.BURN]: 'Burn Token',
  [TOKEN_ACTIONS.CONTRIBUTE]: 'Contribute Token Fee',
  [TOKEN_ACTIONS.BUY]: 'Buy Token',
  [TOKEN_ACTIONS.MINE]: 'Mine Token',
};

export const ConfirmPwdWithAmountModal = ({
  visible,
  setVisible = () => { },
  data,
  type,
}) => {
  // console.log('aaaaaaa', data);

  const dispatch = useDispatch();
  const pwdLoading = useSelector(state =>
    get(state, 'loadingReducer.pwdLoading', false),
  );
  const encryptedPrivateKey = useSelector(state =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );
  const unwAddress = useSelector(state =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );

  const [tokenData, setTokenData] = useState(null);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [frac, setFrac] = useState({ a: 0, b: 0 });

  console.log('sasasas111111asas', data);

  useEffect(() => {
    if (visible) {
      setPwd('');
      setAmount('');
      setFrac({ a: 0, b: 0 });
      setError(null);
      dispatch({ type: PWD_MODAL_LOADING_DISABLE });
    }
  }, [visible]);

  useEffect(() => {
    if (visible && data?.exch_num && data?.exch_unx_num) {
      setTokenData(data);
      const temp = helpers.reduceFraction(
        data?.exch_num * 10 ** 6,
        data?.exch_unx_num,
      );
      setFrac({ a: temp[0], b: temp[1] });
    } else {
      getTokenDetail({ token_name: data?.key, page_size: 1, page_index: 0 })
        .then(res => {
          const tempData = get(res, 'tokens[0]', null);
          // console.log(';a;aaaa', tempData);
          setTokenData(tempData);
          const temp = helpers.reduceFraction(
            tempData?.exch_num * 10 ** 6,
            tempData?.exch_unx_num,
          );
          setFrac({ a: temp[0], b: temp[1] });
        })
        .catch(err => {
          console.log('aaaaa', err);
        });
    }
  }, [data, visible]);

  const handleTokenAction = async () => {
    await setError(null);
    if (
      !helpers.isNumber(amount) ||
      parseFloat(amount) === 0 ||
      !isInteger(parseFloat(amount))
    ) {
      setError({ errAmount: MESSAGES.INVALID_AMOUNT });
      return;
    }
    try {
      dispatch({ type: PWD_MODAL_LOADING_ENABLE });
      const privateKey = await decrypt(encryptedPrivateKey, pwd);
      if (privateKey) {
        handleActionToken({
          action: type,
          tokenName: get(tokenData, 'name', ''),
          amount: parseInt(amount),
          buyerAddress: unwAddress,
          privateKey,
        })
          .then(res => {
            handleSuccessResponse(res);
          })
          .catch(err => {
            handleErrorResponse();
          });
      } else {
        setError({ errPwd: MESSAGES.WRONG_PWD });
      }
    } catch (error) {
      setError({ errPwd: MESSAGES.INVALID_ADDRESS });
    }
  };

  const handleSuccessResponse = async res => {
    dispatch({ type: PWD_MODAL_LOADING_DISABLE });
    setVisible(false);
    if (res?.result) {
      const txID = get(res, 'transaction.txID', '');
      if (txID) {
        setTimeout(() => {
          dispatch({
            type: TX_STATUS_MODAL_SHOW,
            data: txID,
          });
          dispatch({ type: REQUEST_GET_ACCOUNT_RESOURCE });
        }, 401);
      } else {
        dispatch({
          type: TX_STATUS_MODAL_SHOW_ERROR,
          data:
            typeof res === 'string'
              ? res
              : helpers.handleError(get(res, 'error', '')),
        });
      }
    } else {
      dispatch({
        type: TX_STATUS_MODAL_SHOW_ERROR,
        data:
          typeof res === 'string'
            ? res
            : helpers.handleError(get(res, 'error', '')),
      });
    }
  };

  const handleErrorResponse = () => {
    dispatch({ type: PWD_MODAL_LOADING_DISABLE });
    dispatch({
      type: TX_STATUS_MODAL_SHOW_ERROR,
      data: MESSAGES.NORMAL_ERROR,
    });
  };

  return (
    <Modal
      isVisible={visible ? true : false}
      onDismiss={() => {
        setVisible(false);
      }}
      onBackButtonPress={() => { }}
      onBackdropPress={() => { }}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      style={{
        width: metrics.screenWidth,
        height: null,
        marginBottom: 0,
        alignSelf: 'center',
        justifyContent: 'flex-end',
      }}>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 20,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          overflow: 'hidden',
        }}>
        <View
          style={{
            paddingBottom: 25,
          }}>
          <SemiBoldText style={{ fontSize: 20, color: blackColor(0.9) }}>
            {TITLE_TOKEN_TYPE_MAPPING[type]}
          </SemiBoldText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: blackColor(0.9),
            borderRadius: 12,
            paddingVertical: 10,
          }}>
          <View style={styles.box}>
            <BoldText style={{ fontSize: 14, color: '#000' }}>
              {helpers.truncateAbbr(get(tokenData, 'abbr', ''))}
            </BoldText>
          </View>
          <BoldText style={{ fontSize: 20, color: '#fff', marginLeft: 10 }}>
            {get(tokenData, 'name', '') || get(tokenData, 'key', '')}
          </BoldText>
        </View>
        <SemiBoldText style={styles.label}>
          Amount (
          {ACTION_TOKEN_BY_NATIVE_UNW.includes(type) ? CONSTANTS.CURRENCY : tokenData?.name})
          *
        </SemiBoldText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={txt => setAmount(txt)}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#949494"
            />
            {error?.errAmount ? (
              <Animatable.View animation="shake">
                <RegularText style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                  {error.errAmount}
                </RegularText>
              </Animatable.View>
            ) : (
              <RegularText style={{ fontSize: 12, marginTop: 5 }}> </RegularText>
            )}
          </View>
          {type === TOKEN_ACTIONS.BUY && (
            <RegularText style={{ paddingHorizontal: 10 }}>=</RegularText>
          )}
          {type === TOKEN_ACTIONS.BUY && (
            <View style={{ flex: 1 }}>
              <View style={styles.exchangeBox}>
                <View style={{ flex: 1 }}>
                  <SemiBoldText style={{ fontSize: 15 }}>
                    {helpers.formatCurrency(
                      parseFloat(tokenData?.exch_num * 10 ** 6 * amount) /
                      tokenData?.exch_unx_num,
                    )}
                  </SemiBoldText>
                </View>
                <View
                  style={{
                    backgroundColor: CUSTOMIZE.primary_color,
                    borderRadius: 8,
                    paddingVertical: 16,
                    paddingHorizontal: 10,
                  }}>
                  <SemiBoldText style={{ color: COLORS.white, fontSize: 12 }}>
                    {helpers.truncateAbbr(tokenData?.name)}
                  </SemiBoldText>
                </View>
              </View>
              <RegularText
                style={{ fontSize: 12, marginTop: 5, alignSelf: 'flex-end' }}>
                {frac.b} {CONSTANTS.CURRENCY} = {helpers.formatCurrency(frac.a)}{' '}
                {tokenData?.name}
              </RegularText>
            </View>
          )}
        </View>
        <RegularText style={styles.label}>Password *</RegularText>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={pwd}
          onChangeText={txt => setPwd(txt)}
          placeholder="Password"
          placeholderTextColor="#949494"
        />
        {error?.errPwd ? (
          <Animatable.View animation="shake">
            <RegularText style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
              {error.errPwd}
            </RegularText>
          </Animatable.View>
        ) : (
          <RegularText style={{ fontSize: 12, marginTop: 5 }}> </RegularText>
        )}

        <Pressable
          onPress={handleTokenAction}
          disabled={pwd.length == 0 || pwdLoading}
          style={{
            backgroundColor:
              pwd.length == 0 || pwdLoading ? '#4C4C4C' : CUSTOMIZE.primary_color,
            paddingHorizontal: 40,
            paddingVertical: 12,
            borderRadius: 16,
            marginTop: 20,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {pwdLoading ? (
            <ActivityIndicator
              animating={true}
              color={COLORS.white}
              size="small"
            />
          ) : (
            <BoldText style={{ color: COLORS.white, fontSize: 16 }}>
              Confirm
            </BoldText>
          )}
        </Pressable>
        <Pressable
          onPress={() => setVisible(false)}
          style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
          <Icon name="close" style={{ fontSize: 26, color: blackColor(0.7) }} />
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 14,
    color: COLORS.black,
    borderRadius: 8,
    backgroundColor: '#F5F5F6',
    marginTop: 15,
    fontSize: 15,
    fontWeight: '600',
  },
  exchangeBox: {
    paddingLeft: 14,
    borderRadius: 8,
    backgroundColor: '#F5F5F6',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: { color: '#525B6B', marginTop: 20 },
  box: {
    backgroundColor: COLORS.white,
    width: 42,
    height: 42,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
