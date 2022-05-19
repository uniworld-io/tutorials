import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';

import {WalletImage} from '../../components/WalletImage';
import {AppButton} from '../../components/AppButton';
import {blackColor} from '../../utils/colorHelper';
import metrics from '../../config/metrics';
import {helpers} from '../../utils/helpers';
import { CONSTANTS } from '../../config/customize';

const WalletGreeting = (props) => {
  const {navigation, route} = props;

  const {colors} = useTheme();
  const dispatch = useDispatch();

  const [showRule, setShowRule] = useState(false);

  const handleContinue = () => {
    if (!showRule) {
      setShowRule(true);
    } else {
      navigation.navigate('CreateWallet');
    }
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
        }}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <WalletImage style={styles.image} />
          {!showRule ? (
            <View
              style={{
                justifyContent: 'center',
                paddingHorizontal: 25,
                marginTop: 30,
              }}>
              <Text style={styles.title}>Welcome to {CUSTOMIZE.token_name}'s wallet</Text>
              <Text style={[styles.subtitle, {textAlign: 'center'}]}>
                {`Please take a moment to read through this short introduction. It's very important for your own security that you understand these warnings. Ignoring this step will highly increase the chances of your funds being lost or stolen, in which case we won't be able to help you.\nSkip at your own risk.`}
              </Text>
            </View>
          ) : (
            <Animatable.View
              animation="fadeInRight"
              style={{
                justifyContent: 'center',
                paddingHorizontal: 25,
                marginTop: 30,
              }}>
              <Text style={styles.title}>About {CUSTOMIZE.token_name}'s wallet</Text>
              <Text style={styles.subtitle}>
                {`1. Uni Wallet is a secured wallet of UniChain platform.\n2. You can use It to send and receive ${CUSTOMIZE.token_name} or Tokens. \n3. Please note that the private key is encrypted by your password and stored only on your device. The private key and mnemonic are shown only one time when you create your wallet. You are responsible to backup and keep It secret. If you lose the private key or mnemonic, you may lose to access your coins/tokens.`}
              </Text>
            </Animatable.View>
          )}
          <AppButton
            handleAction={handleContinue}
            text={showRule ? 'NEXT' : 'CONTINUE'}
            style={{
              marginTop: 30,
              alignSelf: 'center',
              backgroundColor: 'black',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: helpers.isTablet ? 200 : (4 * metrics.screenWidth) / 9,
    height: helpers.isTablet ? 200 : (4 * metrics.screenWidth) / 9,
    marginTop: -30,
    alignSelf: 'center',
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
  subtitle: {
    marginBottom: 7,
    marginTop: 10,
    lineHeight: 26,
    color: blackColor(0.7),
    fontSize: 15,
  },
});

export default WalletGreeting;
