import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import * as Animatable from 'react-native-animatable';

import * as loginActions from '../../redux/actions/loginActions';

import styles from './styles';
import images from '../../config/images';
import { blackColor } from '../../utils/colorHelper';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

const StartUp = () => {
  const { colors } = useTheme();

  // language
  const [t, i18n] = useTranslation();
  const i18 = (key) => {
    return t(key);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    SplashScreen.hide();
    AppState.addEventListener('change', (state) => {
      SplashScreen.hide();
    });
    dispatch(loginActions.requestAutoLogin());
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animatable.View
        animation="bounceIn"
        duration={800}
        style={{ width: 150, height: 150 }}>
        <Image
          source={images.banner}
          style={{ flex: 1, width: null, height: null }}
        />
      </Animatable.View>
      <Animatable.Text
        animation="fadeIn"
        style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>
        {CUSTOMIZE.token_name} WALLET
      </Animatable.Text>
      <ActivityIndicator
        style={{ marginTop: 20 }}
        animating={true}
        size="large"
        color={blackColor(0.2)}
      />
    </View>
  );
};

export default StartUp;
