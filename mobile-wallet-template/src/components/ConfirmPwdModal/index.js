import React, {useState, useEffect} from 'react';
import {
  View,
  Keyboard,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';

import metrics from '../../config/metrics';
import {blackColor, COLORS} from '../../utils/colorHelper';
import {RegularText} from '../CustomFontText/RegularText';
import {BoldText} from '../CustomFontText/BoldText';
import {Icon} from 'native-base';
import {helpers} from '../../utils/helpers';
import {get} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {PWD_MODAL_LOADING_DISABLE} from '../../redux/actions/types';
import { CUSTOMIZE } from '../../config/customize';

export const ConfirmPwdModal = ({
  visible,
  setVisible = () => {},
  pwd = '',
  setPwd = () => {},
  handleAction = () => {},
  error = null,
  setError = () => {},
  label = 'Enter your password to complete transaction',
}) => {
  // const dispatch = useDispatch();
  const pwdLoading = useSelector(state =>
    get(state, 'loadingReducer.pwdLoading', false),
  );

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setPwd('');
      setError(null);
      // dispatch({type: PWD_MODAL_LOADING_DISABLE});
    }
  }, [visible]);

  return (
    <Modal
      isVisible={visible}
      onDismiss={() => {
        setVisible(false);
      }}
      onBackButtonPress={() => {}}
      onBackdropPress={() => {}}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      onModalHide={() => setVisible(false)}
      style={{
        width: metrics.screenWidth,
        height: null,
        marginBottom: 0,
        alignSelf: 'center',
        justifyContent: 'flex-end',
      }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1, justifyContent: 'flex-end'}}>
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 20,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            overflow: 'hidden',
          }}>
          <BoldText style={{fontSize: 22, color: COLORS.black}}>
            Enter Password
          </BoldText>
          <RegularText style={{color: blackColor(0.5), marginTop: 20}}>
            {label}
          </RegularText>
          <TextInput
            style={{
              padding: 14,
              color: COLORS.black,
              borderRadius: 8,
              backgroundColor: '#F5F5F6',
              textAlign: 'center',
              marginTop: 15,
              fontSize: 15,
            }}
            secureTextEntry
            value={pwd}
            onChangeText={txt => setPwd(txt)}
            placeholder="Your password"
            placeholderTextColor="#949494"
          />
          {error ? (
            <Animatable.View animation="shake">
              <RegularText
                style={{
                  color: 'red',
                  fontSize: 12,
                  marginTop: 5,
                  textAlign: 'center',
                }}>
                {error}
              </RegularText>
            </Animatable.View>
          ) : (
            <RegularText style={{fontSize: 12, marginTop: 5}}> </RegularText>
          )}

          <Pressable
            onPress={() => handleAction(pwd)}
            disabled={!pwd.length || pwdLoading}
            style={{
              backgroundColor:
                pwd.length == 0 || pwdLoading ? '#4C4C4C' : CUSTOMIZE.primary_color,
              paddingHorizontal: 40,
              paddingVertical: 12,
              borderRadius: 16,
              marginTop: 20,
              marginBottom: isKeyboardVisible && helpers.isIOS ? 70 : 20,
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
              <BoldText style={{color: COLORS.white, fontSize: 16}}>
                Confirm
              </BoldText>
            )}
          </Pressable>
          <Pressable
            onPress={() => setVisible(false)}
            style={{position: 'absolute', top: 10, right: 10, padding: 10}}>
            <Icon name="close" style={{fontSize: 26, color: blackColor(0.7)}} />
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    color: blackColor(0.85),
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
