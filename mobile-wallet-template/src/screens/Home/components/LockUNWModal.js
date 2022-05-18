import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon} from 'native-base';

import metrics from '../../../config/metrics';
import {blackColor} from '../../../utils/colorHelper';
import {helpers} from '../../../utils/helpers';
import {AppButton} from '../../../components/AppButton';
import {useDispatch, useSelector} from 'react-redux';
import {decrypt} from '../../../utils/encrypt';
import {lockUNW} from '../../../redux/services/unw';
import {handleLockUnwSuccess} from '../../../redux/actions/walletAction';
import {get} from 'lodash';
import { CONSTANTS } from '../../../config/customize';

export const LockUNWModal = ({
  visible,
  unwAddress,
  setVisible = () => {},
  getTransactionHistory,
  balance,
  alertRef,
}) => {
  const [step, setStep] = useState(0);
  const [pwd, setPwd] = useState('');
  const dispatch = useDispatch();

  const encryptedPrivateKey = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );

  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!visible) {
      setStep(0);
    }
  }, [visible]);

  const handleLockCoin = async () => {
    const privateKey = await decrypt(encryptedPrivateKey, pwd);
    // console.log('asakjsas', privateKey);
    if (privateKey) {
      const result = await lockUNW({
        ginza: amount,
        voter_address: unwAddress,
        voter_privateKey: privateKey,
      });
      // console.log('-a-s-as-a-sas', result);
      if (result.result) {
        dispatch(handleLockUnwSuccess(amount));
        setTimeout(() => {
          setVisible(false);
          setPwd('');
          setAmount('');
          if (alertRef) {
            alertRef.current.alertWithType(
              'success',
              'Success',
              `Lock ${amount} ${CONSTANTS.CURRENCY} successfully`,
            );
          }
        }, 401);
        setTimeout(() => {
          getTransactionHistory();
        }, 15000);
      } else {
        alert(`Something wrong happened`);
      }
    } else {
      alert('Your password is incorrect');
    }
  };

  return (
    <Modal
      isVisible={visible}
      onDismiss={() => {
        setVisible(false);
      }}
      onBackButtonPress={() => {
        setVisible(false);
      }}
      onBackdropPress={() => {
        setVisible(false);
      }}
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
          borderRadius: 8,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 22, fontWeight: '700'}}>Lock {CONSTANTS.CURRENCY} coin</Text>
          <Pressable onPress={() => setVisible(false)}>
            <Icon name="close" style={{fontSize: 28, color: blackColor(0.6)}} />
          </Pressable>
        </View>
        {step == 0 && (
          <View>
            <Text
              style={{
                fontSize: 15,
                marginTop: 20,
                color: blackColor(0.7),
              }}>
              Enter your coin to lock
            </Text>
            <TextInput
              value={amount}
              onChangeText={(txt) => {
                setAmount(val.replace(',', '.'));
              }}
              keyboardType="decimal-pad"
              placeholder={`Enter ${CONSTANTS.CURRENCY} amount to lock`}
              style={{
                color: 'black',
                marginTop: 20,
                width: helpers.isTablet ? 380 : '100%',
                alignSelf: 'center',
                textAlign: 'center',
                backgroundColor: '#E1E1E1',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 26,
              }}
            />
            <Text
              style={{
                marginTop: 5,
                color: blackColor(0.6),
                textAlign: 'center',
              }}>
              {`1UNW <= lock <= ${helpers.formatNumber(balance)}UNW`}
            </Text>
          </View>
        )}
        {step == 1 && (
          <View>
            <Text
              style={{
                color: '#CC393C',
                marginTop: 16,
                textAlign: 'center',
                fontSize: 16,
              }}>
              {amount} {CONSTANTS.CURRENCY} will be locked in 3 days!
            </Text>
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                marginTop: 20,
                color: blackColor(0.7),
              }}>
              Enter your password to submit transaction
            </Text>
            <TextInput
              value={pwd}
              onChangeText={(txt) => setPwd(txt)}
              secureTextEntry
              placeholder="Enter your password"
              style={{
                color: 'black',
                marginTop: 20,
                width: helpers.isTablet ? 380 : '100%',
                alignSelf: 'center',
                textAlign: 'center',
                backgroundColor: '#E1E1E1',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 26,
              }}
            />
          </View>
        )}
        <AppButton
          handleAction={() => {
            if (step == 0) {
              setStep(step + 1);
            } else {
              handleLockCoin();
            }
          }}
          disabled={
            (step == 0 &&
              (isNaN(amount) ||
                amount < 1 ||
                Number.parseFloat(amount) >
                  Number.parseFloat(helpers.formatNumber(balance)))) ||
            (step == 1 && pwd.length == 0)
          }
          minWidth={80}
          text={
            step == 0 ? '       Continue       ' : '        Confirm        '
          }
          style={{alignSelf: 'center', marginTop: 30}}
        />
      </View>
    </Modal>
  );
};
