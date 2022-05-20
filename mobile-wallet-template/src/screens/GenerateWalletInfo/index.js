import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Alert} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

import {WalletImage} from '../../components/WalletImage';
import {AppButton} from '../../components/AppButton';
import {WalletInfo} from '../../components/WalletInfo';
import {walletUtils} from '../../utils/walletHelpers';
import {Loading} from '../../components/Loading';
import {helpers} from '../../utils/helpers';
import {encrypt} from '../../utils/encrypt';
import {
  encryptedPrivateKey,
  fetchWalletInfo,
} from '../../redux/actions/walletAction';
import {get} from 'lodash';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

const GenerateWalletInfo = (props) => {
  const {navigation, route} = props;

  const {colors} = useTheme();
  const dispatch = useDispatch();
  const pwd = get(route, 'params.pwd', null);

  const [loading, setLoading] = useState(true);
  const [dispatchData, setDispatchData] = useState(null);
  const [walletInfo, setWalletInfo] = useState({
    address: ' ',
    privateKey: ' ',
    mnemonic: ' ',
  });

  useEffect(() => {
    generateWalletInfo();
  }, []);

  const generateWalletInfo = async () => {
    const mnemonic = await walletUtils.generateMnemonic();
    const privateKey = await walletUtils.generatePrivateKeyFromMnemonic(
      mnemonic,
    );
    const unwAddress = await walletUtils.genUnwAddressFromPrivateKey(
      helpers.removeHexPrefix(privateKey),
    );
    await setLoading(false);
    if (mnemonic && privateKey && unwAddress && pwd) {
      setWalletInfo({
        address: unwAddress,
        privateKey: helpers.removeHexPrefix(privateKey),
        mnemonic: mnemonic,
      });
      const hashPrivateKey = await encrypt(
        helpers.removeHexPrefix(privateKey),
        pwd,
      );
      setDispatchData({
        address: unwAddress,
        hashPrivateKey,
      });
    } else {
      Alert.alert(
        'Oops!',
        'Something wrong happened. Please try again!',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Re-generate', onPress: () => generateWalletInfo()},
        ],
        {cancelable: false},
      );
    }
  };

  const handleSubmit = () => {
    if (dispatchData && dispatchData.address && dispatchData.hashPrivateKey) {
      dispatch(
        fetchWalletInfo({
          unwAddress: dispatchData.address,
        }),
      );
      dispatch(encryptedPrivateKey(dispatchData.hashPrivateKey));
    } else {
      alert('Something wrong happened. Please try again!');
    }
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <WalletImage style={{alignSelf: 'center'}} />
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
          }}>
          <Text style={styles.title}>Your {CUSTOMIZE.token_name}'s wallet Info</Text>
          <View style={{paddingHorizontal: 15, marginTop: 7}}>
            <WalletInfo content={walletInfo.address} numberOfLines={2} />
            <WalletInfo
              label="Your Private Key"
              content={walletInfo.privateKey}
              numberOfLines={2}
            />
            <WalletInfo
              label="Your Mnemonic Phrase"
              content={walletInfo.mnemonic}
              numberOfLines={6}
            />
            <AppButton
              handleAction={handleSubmit}
              text="OK"
              style={[
                {marginTop: 30, backgroundColor: 'black', alignSelf: 'center'},
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
});

export default GenerateWalletInfo;
