import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';

import { WalletImage } from '../../components/WalletImage';
import { useCheckBox } from '../../components/CheckBox';
import { useInput } from '../../components/TextInput';
import { AppButton } from '../../components/AppButton';
import { blackColor } from '../../utils/colorHelper';
import { walletUtils } from '../../utils/walletHelpers';
import { helpers, SCREEN_WIDTH } from '../../utils/helpers';
import { Loading } from '../../components/Loading';
import { fetchWalletInfo } from '../../redux/actions/walletAction';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

const ImportWallet = (props) => {
  const { navigation } = props;

  const { colors } = useTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (!isFocused) {
      setLoading(false);
    }
  }, [isFocused]);

  const [loading, setLoading] = useState(false);

  const [prv, setPrv, prvCb] = useCheckBox({
    init: true,
    style: { marginTop: 20, paddingBottom: 10 },
    handleAction: () => {
      if (!prv) {
        setMnemonic(false);
      } else {
        setMnemonic(true);
      }
    },
  });
  const [mnemonic, setMnemonic, mnemonicCb] = useCheckBox({
    init: false,
    text: 'Your mnemonic',
    style: { marginTop: 20, paddingBottom: 10 },
    handleAction: () => {
      if (!mnemonic) {
        setPrv(false);
      } else {
        setPrv(true);
      }
    },
  });

  const [pri, setPri, priInput] = useInput({
    active: prv,
    init: '',
    pasted: true,
    style: { textAlign: 'center' },
  });
  const [mnem, setMnem, mnemInput] = useInput({
    isArea: true,
    active: mnemonic,
    pasted: true,
    init: '',
  });

  const handleGenerate = async () => {
    setLoading(true);
    setTimeout(async () => {
      let unwAddress = false;
      let privateKey = null;
      if (prv) {
        if (helpers.validatePrivateKey(pri)) {
          unwAddress = walletUtils.genUnwAddressFromPrivateKey(pri);
        } else {
          alert('Your private key is wrong. The length of private key must be 64');
          setLoading(false);
        }
      } else if (mnemonic) {
        const temp = mnem.split(" ");
        if (temp?.length === 12) {
          privateKey = walletUtils.generatePrivKeyWithUnichain(mnem);
        } else {
          privateKey = walletUtils.generatePrivateKeyFromMnemonic(mnem);
        }

        unwAddress = walletUtils.genUnwAddressFromPrivateKey(
          temp.length === 12 ? privateKey : helpers.removeHexPrefix(privateKey),
        );
      } else {
        alert('Something wrong happened');
      }
      setLoading(false);
      if (unwAddress) {
        dispatch(
          fetchWalletInfo({
            unwAddress,
          }),
        );
        navigation.navigate('CreateWallet', {
          fromImport: true,
          privateKey: prv ? pri : helpers.removeHexPrefix(privateKey),
          unwAddress,
        });
      } else {
        alert('Your private key or mnemonic is wrong. Please try again');
      }
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <WalletImage />
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: 30,
          }}>
          <Text style={styles.title}>Import existing wallet</Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            Enter your private key or mnemonic of your {CUSTOMIZE.token_name}'s wallet
          </Text>
          <View
            style={{
              alignItems: 'center',
              width: helpers.isTablet ? 500 : SCREEN_WIDTH - 40,
              // paddingHorizontal: 30,
            }}>
            {prvCb}
            {priInput}
            {mnemonicCb}
            {mnemInput}
            <AppButton
              text="CONTINUE"
              handleAction={handleGenerate}
              disabled={
                !(
                  (prv && pri.trim().length > 0) ||
                  (mnemonic && mnem.trim().length > 0)
                )
              }
              style={[
                { marginTop: 30 },
                ((prv && pri.trim().length > 0) ||
                  (mnemonic && mnem.trim().length > 0)) && {
                  backgroundColor: 'black',
                },
              ]}
            />
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('WalletGreeting')}
          style={{ alignSelf: 'center', padding: 12 }}>
          <Text style={{ color: blackColor(0.6) }}>
            Don't have one, please
            <Text style={{ fontWeight: 'bold' }}> create now</Text>
          </Text>
        </Pressable>
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
    marginTop: 6,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 22
  },
});

export default ImportWallet;
