import {get, isNumber} from 'lodash';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable, Keyboard} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import metrics from '../../config/metrics';
import {blackColor} from '../../utils/colorHelper';
import {AppButton} from '../AppButton';
import {useCheckBox} from '../CheckBox';
import {useInput} from '../TextInput';
import {helpers} from '../../utils/helpers';
import {isUnwAddress} from '../../redux/services/unw';
import {Icon} from 'native-base';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

export const SendUniModal = ({
  visible,
  setVisible = () => {},
  handleContinue = () => {},
  setTransactionInfo = () => {},
  count,
}) => {
  useEffect(() => {
    if (count > 0) {
      resetField();
    }
  }, [count]);

  const resetField = () => {
    setAmount('');
    setAddress('');
    setNote('');
    setChecked(false);
    setError(null);
    setErrorAd(null);
  };

  const walletBalance = useSelector((state) =>
    get(state, 'walletReducer.walletResource.balance', 0),
  );

  const unwAddress = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );

  const [amount, setAmount, amountInput] = useInput({
    active: true,
    keyboardType: 'decimal-pad',
  });
  const [address, setAddress, addressInput] = useInput({
    active: true,
    isQRInput: true,
    setVisible: setVisible,
  });
  const [note, setNote, noteInput] = useInput({
    active: true,
    isArea: true,
  });
  const [checked, setChecked, checkedCb] = useCheckBox({
    init: false,
    text: '',
    style: {marginTop: 20, paddingBottom: 10},
  });

  const [error, setError] = useState(null);
  const [errorAd, setErrorAd] = useState(null);

  const requestContinue = async () => {
    await setError(null);
    await setErrorAd(null);
    if (Number.isNaN(Number(amount))) {
      await setError('A number is required');
      return;
    } else if (Number(amount) > helpers.formatNumber(walletBalance)) {
      if (walletBalance == 0) {
        await setError(`You don't have any ${CUSTOMIZE.token_name}`);
      } else {
        await setError(
          `You need input a number <= ${helpers.formatNumber(walletBalance)}`,
        );
      }
      return;
    } else if (!isUnwAddress(address)) {
      await setErrorAd(`Your address is invalid`);
    } else if (unwAddress == address) {
      await setErrorAd(`You cannot send to your own address`);
      return;
    } else {
      handleContinue();
      setTransactionInfo({
        to_address: address,
        amount: Number(amount) * 1000000,
      });
    }
  };

  return (
    <Modal
      isVisible={visible}
      onDismiss={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => Keyboard.dismiss()}
      useNativeDriver={true}
      avoidKeyboard={true}
      style={{
        width: metrics.screenWidth,
        height: null,
        marginBottom: 0,
        alignSelf: 'center',
        justifyContent: 'flex-end',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          // borderRadius: 8,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}>
          <View style={{width: 40, height: 40}} />
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Send {CUSTOMIZE.token_name}
          </Text>
          <Pressable
            onPress={() => {
              resetField();
              setVisible(false);
            }}
            style={{
              width: 40,
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Icon
              name="ios-close"
              style={{color: blackColor(0.4), fontSize: 30}}
            />
          </Pressable>
        </View>
        <Text style={styles.label}>UNW amount</Text>
        {amountInput}
        {error && (
          <Animatable.Text
            animation="shake"
            style={{fontSize: 12, color: 'red', marginTop: 3, marginLeft: 5}}>
            {error}
          </Animatable.Text>
        )}
        <Text style={[styles.label, {marginTop: 15}]}>Send to</Text>
        {addressInput}
        {errorAd && (
          <Animatable.Text
            animation="shake"
            style={{fontSize: 12, color: 'red', marginTop: 3, marginLeft: 5}}>
            {errorAd}
          </Animatable.Text>
        )}
        <Text style={[styles.label, {marginTop: 15}]}>
          <Text>Note </Text>
          <Text style={{fontStyle: 'italic'}}>(optional)</Text>
        </Text>
        {noteInput}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {checkedCb}
          <Pressable
            onPress={() =>
              helpers._handleLink('https://explorer.unichain.world/')
            }
            style={{flex: 1}}>
            <Text style={{marginTop: 10, color: blackColor(0.7)}}>
              I accept{' '}
              <Text style={{textDecorationLine: 'underline'}}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={{textDecorationLine: 'underline'}}>
                Privacy Policy
              </Text>
            </Text>
          </Pressable>
        </View>
        <AppButton
          handleAction={requestContinue}
          disabled={
            amount.trim().length == 0 || address.trim().length == 0 || !checked
          }
          text="CONTINUE"
          style={{alignSelf: 'center', marginTop: 20}}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    color: blackColor(0.7),
    fontSize: 13,
    marginBottom: 7,
  },
});
