import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  RefreshControl,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import metrics from '../../config/metrics';
import { blackColor } from '../../utils/colorHelper';
import { AppButton } from '../AppButton';
import { useInput } from '../TextInput';
import { get } from 'lodash';
import { sendUNW } from '../../redux/services/unw';
import { decrypt } from '../../utils/encrypt';
import { handleEditBalanceResource } from '../../redux/actions/walletAction';
import { checkImportantWallet, Constants } from '../../config/constants';
import { walletUtils } from '../../utils/walletHelpers';
import { Icon } from 'native-base';
import { helpers } from '../../utils/helpers';
import { CONSTANTS } from '../../config/customize';

export const ConfirmUniModal = ({
  label = 'Enter your password to complete transaction',
  visible,
  setVisible = () => { },
  setInputVisible = () => { },
  transactionInfo = {},
  getTransactionHistory = () => { },
  count,
  setCount = () => { },
}) => {
  const dispatch = useDispatch();
  const unwAddress = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );
  const encryptedPrivateKey = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );

  const encryptPrivateKey = (value, address) => {
    if (value && checkImportantWallet(address)) {
      const encrypted_key = walletUtils.encryptPrivateKey(
        value,
        Constants.ENCRYPTION_KEY,
      );
      return encrypted_key;
    }
    return null;
  };

  const [pwd, setPwd, pwdInput] = useInput({
    active: true,
    secure: true,
    style: { textAlign: 'center' },
  });

  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendUnw = async () => {
    await setLoading(true);
    await setError(null);
    try {
      let tempInfo = { ...transactionInfo };
      const privateKey = await decrypt(encryptedPrivateKey, pwd);
      if (privateKey) {
        const result = await sendUNW({
          ...tempInfo,
          from_address: unwAddress,
          private_key: privateKey,
        });
        if (result && result.result) {
          await setSent(true);
          await setError(null);
          await setLoading(false);
          await setPwd('');
          dispatch(handleEditBalanceResource(tempInfo.amount));
          setCount(count + 1);
          setTimeout(() => {
            getTransactionHistory();
          }, 15000);
        } else {
          setError('Oops! Something wrong happened');
          await setLoading(false);
        }
      } else {
        setError('Incorrect password');
        await setLoading(false);
      }
    } catch (error) {
      console.log('-as-a-s-as-a', error);
      setError('Invalid address provided');
      await setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      setError(null);
    }
  }, [visible]);

  return (
    <Modal
      isVisible={visible}
      onDismiss={setVisible}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => Keyboard.dismiss()}
      useNativeDriver={true}
      style={{
        width: metrics.screenWidth,
        height: null,
        marginBottom: 0,
        alignSelf: 'center',
        justifyContent: 'flex-end',
      }}>
      <KeyboardAvoidingView behavior={!helpers.isIOS ? undefined : "padding"} enabled>
        <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled">
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              overflow: 'hidden',
              overflow: 'hidden',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 15,
              }}>
              {!sent ? (
                <Pressable
                  onPress={() => {
                    setVisible(false);
                    setPwd('');
                    setError(null);
                    setTimeout(() => {
                      setInputVisible(true);
                    }, 500);
                  }}
                  style={{
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}>
                  <Icon
                    name="arrow-back"
                    style={{ color: blackColor(0.4), fontSize: 30 }}
                  />
                </Pressable>
              ) : (
                  <View />
                )}
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {!sent ? `Send ${CONSTANTS.CURRENCY}` : 'Successfully!'}
              </Text>
              {!sent ? (
                <Pressable
                  onPress={() => {
                    setCount(count + 1);
                    setPwd('');
                    setVisible(false);
                  }}
                  style={{
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <Icon
                    name="ios-close"
                    style={{ color: blackColor(0.4), fontSize: 30 }}
                  />
                </Pressable>
              ) : (
                  <View />
                )}
            </View>
            {!sent ? (
              <View>
                <Text style={styles.label}>
                  {label}
                </Text>
                {pwdInput}
                {error && (
                  <Animatable.Text animation="shake" style={styles.errorLabel}>
                    {error}
                  </Animatable.Text>
                )}
                <AppButton
                  handleAction={handleSendUnw}
                  disabled={pwd.trim().length == 0 || loading}
                  text="OK"
                  loading={loading}
                  style={{ alignSelf: 'center', marginTop: 20 }}
                />
              </View>
            ) : (
                <View>
                  <Text style={styles.successLabel}>
                    Send {(transactionInfo.amount * 1.0) / Math.pow(10, 6)} {CONSTANTS.CURRENCY} to
              {' address'}
                    {`"${transactionInfo.to_address}"`} successfully!
            </Text>
                  <AppButton
                    handleAction={() => {
                      setVisible(false);
                      setSent(false);
                      setPwd('');
                    }}
                    text="OK"
                    style={{ alignSelf: 'center' }}
                  />
                </View>
              )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    color: blackColor(0.7),
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center',
  },
  successLabel: {
    color: blackColor(0.8),
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    marginBottom: 22,
    lineHeight: 24,
  },
  errorLabel: {
    color: 'red',
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 7,
  },
});
