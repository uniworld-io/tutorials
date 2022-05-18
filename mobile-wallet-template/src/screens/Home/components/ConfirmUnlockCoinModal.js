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
import {unlockUnw} from '../../../redux/services/unw';
import {handleUnlockUnwSuccess} from '../../../redux/actions/walletAction';
import {get} from 'lodash';
import { CONSTANTS } from '../../../config/customize';

export const ConfirmUnlockCoinModal = ({
  visible,
  unwAddress,
  setVisible = () => {},
  lock,
  getTransactionHistory,
  getAccRes,
  alertRef,
}) => {
  const [step, setStep] = useState(0);
  const [pwd, setPwd] = useState('');
  const dispatch = useDispatch();

  const encryptedPrivateKey = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );

  useEffect(() => {
    if (!visible) {
      setStep(0);
    }
  }, [visible]);

  const handleUnlockCoin = async () => {
    const privateKey = await decrypt(encryptedPrivateKey, pwd);
    if (privateKey) {
      const result = await unlockUnw({
        ownerAddress: unwAddress,
        privateKey,
        type: 'BANDWIDTH',
      });
      //   console.log('-a-s-as-a-sas', result);
      if (result.result) {
        dispatch(handleUnlockUnwSuccess(lock));
        setTimeout(() => {
          setVisible(false);
          setPwd('');
          if (alertRef) {
            alertRef.current.alertWithType(
              'success',
              'Success',
              `Unlock ${CONSTANTS.CURRENCY} successfully`,
            );
          }
        }, 401);
        setTimeout(() => {
          getTransactionHistory();
        }, 15000);
      } else {
        alert(`It's not time to unfreeze(BANDWIDTH)`);
      }
    } else {
      alert('Your password is incorrect');
    }
  };

  return (
    <Modal
      isVisible={visible}
      onDismiss={() => {
        // setStep(0);
        setVisible(false);
      }}
      onBackButtonPress={() => {
        // setStep(0);
        setVisible(false);
      }}
      onBackdropPress={() => {
        // setStep(0);
        setVisible(false);
      }}
      useNativeDriver={true}
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
          <Text style={{fontSize: 22, fontWeight: '700'}}>Unlock {CONSTANTS.CURRENCY} coin</Text>
          <Pressable onPress={() => setVisible(false)}>
            <Icon name="close" style={{fontSize: 28, color: blackColor(0.6)}} />
          </Pressable>
        </View>
        {step == 0 && (
          <Text style={{marginTop: 20, textAlign: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: '700'}}>
              {helpers.formatNumber(lock)}
            </Text>{' '}
            {CONSTANTS.CURRENCY} will be unlocked
          </Text>
        )}
        {step == 1 && (
          <View>
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
              handleUnlockCoin();
            }
          }}
          disabled={false}
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
