import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Pressable,
  Image,
  Text,
  TextInput,
} from 'react-native';
import { find, get } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

import { useDispatch, useSelector } from 'react-redux';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { helpers } from '../../utils/helpers';
import { RegularText } from '../../components/CustomFontText/RegularText';
import { Icon } from 'native-base';
import Checkbox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import { SemiBoldText } from '../../components/CustomFontText/SemiBoldText';
import images from '../../config/images';
import { BoldText } from '../../components/CustomFontText/BoldText';
import { ThinText } from '../../components/CustomFontText/ThinText';
import { isUnwAddress } from '../../redux/services/unw';
import { decrypt } from '../../utils/encrypt';
import {
  actRequestTransferToken,
  actSendNativeUNW,
  actSendNativeUNWFuture,
  actSendUNWToken,
} from '../../redux/actions/walletAction';
import { ConfirmPwdModal } from '../../components/ConfirmPwdModal';
import moment from 'moment';
import Clipboard from '@react-native-community/clipboard';
import {
  PWD_MODAL_LOADING_DISABLE,
  PWD_MODAL_LOADING_ENABLE,
} from '../../redux/actions/types';
import { styles } from './styles';
import { TxStatusModal } from '../../components/TxStatusModal';
import { TokenSelectionModal } from './com/TokenSelectionModal';
import { LOCAL_KEYS, MESSAGES } from '../../config/constants';
import { apiClient } from '../../redux/services/client';
import { getLocalJson } from '../../utils/localStorage';
import { SuggestAccLocallyModal } from '../../components/SuggestAccLocallyModal';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

const SendCoin = props => {
  const { navigation, route } = props;

  const alertRef = useRef();
  const dispatch = useDispatch();

  const unwAddress = useSelector(state =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );
  const encryptedPrivateKey = useSelector(state =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );
  const walletResource = useSelector(state =>
    get(state, 'walletReducer.walletResource', null),
  );
  const { txVisible } = useSelector(state => state.modalReducer);

  const [selectedCurrency, setSelectedCurrency] = useState({
    key: CONSTANTS.CURRENCY,
    value: get(walletResource, 'balance', 0),
  });
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [errorAd, setErrorAd] = useState(null);
  const [pwd, setPwd] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [future, setFuture] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [expiredTime, setExpiredTime] = useState(
    new Date(moment().clone().add(1, 'days').format('L')),
  );
  const [tokenShown, setTokenShown] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [fee, setFee] = useState(0);

  const [clue, setClue] = useState(false);
  const [count, setCount] = useState(false);

  useEffect(() => {
    if (!txVisible && count) {
      setTimeout(() => {
        console.log('11111');
        checkExistingAccount(receiver);
      }, 401);
    }
  }, [txVisible]);

  const resetInput = () => {
    setReceiver('');
    setAmount('');
  }

  useEffect(() => {
    const tempData = [
      { key: CONSTANTS.CURRENCY, value: get(walletResource, 'balance', 0) },
      ...get(walletResource, 'token', []),
    ];
    const currentSelected = find(tempData, item => {
      return item.key === selectedCurrency.key;
    });
    setSelectedCurrency(currentSelected);
  }, [walletResource]);

  useEffect(() => {
    if (isNaN(amount) || amount <= 0 || receiver.trim().length == 0) {
      setDisabled(true);
    } else {
      if (selectedCurrency.key === CONSTANTS.CURRENCY) {
        if (amount > helpers.formatNumber(get(walletResource, 'balance', 0))) {
          setDisabled(true);
        } else {
          setDisabled(false);
        }
      } else {
        if (amount > get(selectedCurrency, 'value', 0)) {
          setDisabled(true);
        } else {
          setDisabled(false);
        }
      }
    }
  }, [amount, walletResource, receiver]);

  useEffect(() => {
    if (selectedCurrency && amount) {
      apiClient
        .post('wallet/gettokenpool', {
          token_name: selectedCurrency.key,
          page_size: 10,
          page_index: 0,
        })
        .then(res => {
          const firstToken = get(res, 'tokens[0]', null);
          // console.log(firstToken);
          if (firstToken) {
            setFee(
              get(firstToken, 'fee', 0) +
              parseFloat(amount) *
              parseFloat(
                (get(firstToken, 'extra_fee_rate', 0) * 1.0) / 100,
              ),
            );
          }
        });
    }
  }, [selectedCurrency, amount]);

  const requestSendCoin = async () => {
    await setErrorAd(null);
    if (!isUnwAddress(receiver)) {
      await setErrorAd(MESSAGES.INVALID_ADDRESS);
    } else if (unwAddress == receiver) {
      await setErrorAd(MESSAGES.ERROR_YOURSELF);
      return;
    } else {
      setVisible(true);
      // handleSendCoin();
    }
  };

  const handleSendCoin = async () => {
    dispatch({ type: PWD_MODAL_LOADING_ENABLE });
    await setError(null);
    try {
      const privateKey = await decrypt(encryptedPrivateKey, pwd);
      setCount(true);
      if (privateKey) {
        if (future) {
          if (selectedCurrency.key === CONSTANTS.CURRENCY) {
            dispatch(
              actSendNativeUNWFuture({
                owner_address: unwAddress,
                to_address: receiver,
                amount: amount,
                expire_time: new Date(expiredTime).getTime(),
                privateKey: privateKey,
              }),
            );
          } else {
            dispatch(
              actRequestTransferToken({
                owner_address: unwAddress,
                to_address: receiver,
                token_name: selectedCurrency.key,
                amount: parseInt(amount),
                available_time: new Date(expiredTime).getTime(),
                privateKey: privateKey,
              }),
            );
          }
        } else {
          if (selectedCurrency.key === CONSTANTS.CURRENCY) {
            dispatch(
              actSendNativeUNW({
                from_address: unwAddress,
                to_address: receiver,
                amount: amount,
                private_key: privateKey,
                description: '',
              }),
            );
          } else {
            dispatch(
              actSendUNWToken({
                owner_address: unwAddress,
                to_address: receiver,
                token_name: selectedCurrency.key,
                amount: parseInt(amount),
                privateKey: privateKey,
              }),
            );
          }
        }
      } else {
        setError(MESSAGES.WRONG_PWD);
        dispatch({ type: PWD_MODAL_LOADING_DISABLE });
      }
    } catch (error) {
      dispatch({ type: PWD_MODAL_LOADING_DISABLE });
      setError(MESSAGES.INVALID_ADDRESS);
    }
  };

  const checkExistingAccount = async (address) => {
    const localAcc = await getLocalJson(LOCAL_KEYS.FAV_ACC);
    // console.log('la sao ta', !localAcc || (address && localAcc && !helpers.validateExistingAdd(address, localAcc)));
    if (!localAcc || (address && localAcc && !helpers.validateExistingAdd(address, localAcc))) {
      setClue(true);
    } else {
      setReceiver('');
      setAmount('');
    }
  }

  const handleSetMax = () => {
    if (selectedCurrency.key === CONSTANTS.CURRENCY) {
      setAmount(
        helpers.formatNumber(get(selectedCurrency, 'value', 0)).toString(),
      );
    } else {
      setAmount(get(selectedCurrency, 'value', 0).toString());
    }
  };

  const handlePaste = async () => {
    const val = await Clipboard.getString();
    setReceiver(val);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 15 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ padding: 20 }}
          style={{ flex: 1 }}>
          <SemiBoldText style={styles.label}>Currency *</SemiBoldText>
          <Pressable
            onPress={() => setTokenShown(true)}
            style={styles.currencyContainer}>
            <Image
              source={
                selectedCurrency.key === CONSTANTS.CURRENCY
                  ? CUSTOMIZE.nativeToken
                  : images.unwCashGr
              }
              style={{ width: 30, height: 30, borderRadius: 6 }}
            />
            <View style={styles.leftCurrency}>
              <BoldText style={{ fontSize: 15 }}>
                {get(selectedCurrency, 'key', '')}
              </BoldText>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <SemiBoldText style={{ marginHorizontal: 4, fontSize: 18 }}>
                  {selectedCurrency.key === CONSTANTS.CURRENCY
                    ? helpers.formatAmount(
                      helpers.formatNumber(get(selectedCurrency, 'value', 0)),
                      6,
                    )
                    : selectedCurrency.value}
                </SemiBoldText>
                <Icon
                  name="chevron-thin-down"
                  type="Entypo"
                  style={{ fontSize: 16, color: '#a8a8a8' }}
                />
              </View>
            </View>
          </Pressable>

          <View>
            <SemiBoldText style={[styles.label, { marginTop: 15 }]}>
              To address *
            </SemiBoldText>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.input}
                value={receiver}
                onChangeText={txt => setReceiver(txt)}
                placeholder="Input destination"
                placeholderTextColor="#CDCDCD"
              />
              <Pressable
                style={{ paddingVertical: 9 }}
                onPress={() =>
                  navigation.navigate('FavoriteReceiver', { setValue: setReceiver })
                }>
                <Icon
                  name="shield-account-outline"
                  type="MaterialCommunityIcons"
                  style={{ fontSize: 22, color: '#434343', marginHorizontal: 10 }}
                />
              </Pressable>
              <Pressable
                style={{ paddingVertical: 9 }}
                onPress={() =>
                  navigation.navigate('WalletScanner', { setValue: setReceiver })
                }>
                <Icon
                  name="qr-code-outline"
                  type="Ionicons"
                  style={{ fontSize: 22, color: '#434343', marginHorizontal: 10 }}
                />
              </Pressable>
              <Pressable style={{ paddingVertical: 10 }} onPress={handlePaste}>
                <Icon
                  name="paste"
                  type="FontAwesome5"
                  style={{ fontSize: 22, color: '#434343', marginHorizontal: 14 }}
                />
              </Pressable>
            </View>
            {errorAd && (
              <Animatable.View animation="shake">
                <RegularText style={styles.error}>{errorAd}</RegularText>
              </Animatable.View>
            )}
          </View>

          <SemiBoldText style={[styles.label, { marginTop: 15 }]}>
            Amount *
          </SemiBoldText>

          <View style={styles.amountContainer}>
            <TextInput
              value={amount}
              selectionColor={blackColor(0.5)}
              keyboardType="decimal-pad"
              onChangeText={val => {
                setAmount(val.replace(',', '.'));
              }}
              style={styles.input}
            />
            <Pressable onPress={handleSetMax} style={styles.unwBox}>
              <RegularText style={styles.unwTxt}>MAX</RegularText>
            </Pressable>
          </View>
          <ThinText
            style={{
              fontSize: 13,
              color: '#525B6B',
              marginTop: 8,
            }}>
            <Text style={{ color: '#9D9E9F' }}>Transaction Fee: </Text>
            <Text style={{ fontWeight: '500' }}>
              {' '}
              {selectedCurrency.key === CONSTANTS.CURRENCY ? '0,000267' : fee}{' '}
              {selectedCurrency.key}
            </Text>
          </ThinText>
          {/* section future */}
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <Checkbox
              value={future}
              onValueChange={() => setFuture(!future)}
              onCheckColor={COLORS.white}
              onTintColor={COLORS.blue}
              onAnimationType="fill"
              offAnimationType="fill"
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              tintColors={{ true: COLORS.black, false: '#aaaaaa' }}
              boxType="square"
              onFillColor={COLORS.blue}
            />
            <RegularText
              style={{
                color: '#525B6B',
                fontSize: 13,
                marginBottom: 5,
                marginLeft: -3,
              }}>
              Send Future
            </RegularText>
          </View>

          <SemiBoldText style={[styles.label, { marginTop: 12 }]}>
            Expire time
          </SemiBoldText>
          <Pressable
            disabled={!future}
            onPress={() => setDateVisible(!dateVisible)}
            style={styles.timeContainer}>
            <SemiBoldText
              style={[styles.input, !future && { color: blackColor(0.4) }]}>
              {moment(expiredTime).format('DD/MM/YYYY')}
            </SemiBoldText>
            <Icon
              name="calendar"
              type="Feather"
              style={{
                fontSize: 18,
                color: future ? COLORS.black : blackColor(0.4),
              }}
            />
          </Pressable>

          <Pressable
            onPress={requestSendCoin}
            disabled={disabled}
            style={{
              ...styles.sendBtn,
              backgroundColor: disabled ? '#4C4C4C' : CUSTOMIZE.primary_color,
            }}>
            <BoldText style={{ color: COLORS.white, fontSize: 20 }}>
              {future ? 'Send Future' : 'Send'}
            </BoldText>
          </Pressable>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <ConfirmPwdModal
        visible={visible}
        setVisible={setVisible}
        pwd={pwd}
        setPwd={setPwd}
        handleAction={handleSendCoin}
        error={error}
        setError={setError}
      />
      <TxStatusModal
        dismissOtherModals={() => {
          setVisible(false);
        }}
      />
      <SuggestAccLocallyModal
        visible={clue}
        setVisible={setClue}
        acc={receiver}
        resetInput={resetInput}
      />
      <DropdownAlert ref={alertRef} />
      <DatePicker
        modal={true}
        androidVariant="iosClone"
        mode="date"
        // timeZoneOffsetInMinutes={1440}
        minimumDate={new Date(moment().clone().add(1, 'days').format('L'))}
        open={dateVisible}
        date={expiredTime}
        onConfirm={date => {
          console.log('data', date);
          setDateVisible(false);
          setExpiredTime(date);
        }}
        title="Select Expire Time"
        onCancel={() => {
          setDateVisible(false);
        }}
      />
      <TokenSelectionModal
        visible={tokenShown}
        setVisible={setTokenShown}
        onSelect={setSelectedCurrency}
      />
    </View>
  );
};

export default SendCoin;
