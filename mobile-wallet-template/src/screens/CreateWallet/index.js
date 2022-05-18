import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

import {WalletImage} from '../../components/WalletImage';
import {useInput} from '../../components/TextInput';
import {AppButton} from '../../components/AppButton';
import {blackColor} from '../../utils/colorHelper';
import {get} from 'lodash';
import {helpers, SCREEN_WIDTH} from '../../utils/helpers';
import {requestLogin} from '../../redux/actions/loginActions';
import {
  encryptedPrivateKey,
  fetchWalletInfo,
} from '../../redux/actions/walletAction';
import {decrypt, encrypt} from '../../utils/encrypt';
import validateLogin from '../../redux/services/loginUser';
import {walletUtils} from '../../utils/walletHelpers';
import {checkImportantWallet, Constants} from '../../config/constants';
import {Loading} from '../../components/Loading';

const CreateWallet = (props) => {
  const {navigation, route} = props;
  const fromImport = get(route, 'params.fromImport', false);
  const privateKey = get(route, 'params.privateKey', null);
  const unwAddress = get(route, 'params.unwAddress', null);

  const {colors} = useTheme();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [pwd, setPwd, pwdInput] = useInput({
    active: true,
    secure: true,
    style: {textAlign: 'center'},
    init: '',
  });
  const [confirmPwd, setConfirmPwd, confirmPwdInput] = useInput({
    active: true,
    secure: true,
    style: {textAlign: 'center'},
    init: '',
  });

  const handleConfirm = async () => {
    await setLoading(true);

    if (fromImport) {
      if (!helpers.validatePwd(pwd)) {
        await setLoading(false);
        alert(
          'Your password are at least 8 characters, 1 special character and 1 uppercase letter',
        );
      } else {
        if (privateKey) {
          const encryptedKey = await encrypt(privateKey, pwd);
          dispatch(encryptedPrivateKey(encryptedKey));
        }
        await setLoading(false);
      }
    } else {
      if (!helpers.validatePwd(pwd) || !helpers.validatePwd(confirmPwd)) {
        await setLoading(false);
        alert(
          'Your password and confirm password are at least 8 characters, 1 special character and 1 uppercase letter',
        );
      } else if (pwd != confirmPwd) {
        await setLoading(false);
        alert('Password not match');
      } else {
        await setLoading(false);
        navigation.navigate('GenerateWalletInfo', {pwd});
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <WalletImage />
        <View
          style={{
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <Text style={styles.title}>
            {fromImport ? `Secure Password` : 'Enter Secure Password'}
          </Text>
          <Text style={[styles.subtitle, {color: blackColor(0.7)}]}>
            Your password is at least 8 characters, 1 special character and 1
            uppercase letter
          </Text>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: helpers.isTablet ? 500 : SCREEN_WIDTH - 40,
            }}>
            <Text style={styles.label}>Your password</Text>
            {pwdInput}
            {!fromImport && (
              <View style={{width: '100%'}}>
                <Text style={styles.label}>Confirm your password</Text>
                {confirmPwdInput}
              </View>
            )}
            <Text style={[styles.label, {marginTop: 20}]}>
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                DO NOT FORGET
              </Text>{' '}
              to save your password.{'\n'}You will need this password to unlock
              your wallet
            </Text>
            <AppButton
              handleAction={handleConfirm}
              text="CONFIRM"
              disabled={
                !(
                  pwd.trim().length > 0 &&
                  (fromImport || confirmPwd.trim().length > 0)
                )
              }
              style={[
                {marginTop: 30},
                pwd.trim().length > 0 &&
                  (fromImport || confirmPwd.trim().length > 0) && {
                    backgroundColor: 'black',
                  },
              ]}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 7,
    lineHeight: 22,
  },
  label: {
    textAlign: 'center',
    paddingVertical: 7,
    marginTop: 10,
    color: blackColor(0.7),
    lineHeight: 22,
  },
});

export default CreateWallet;
