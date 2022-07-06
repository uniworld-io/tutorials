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
  actSendUrc20Token,
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

  const [selectedCurrency, setSelectedCurrency] = useState(find(walletResource?.urc20, asset => asset.key === CUSTOMIZE.token_name),);
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
  // const [fee, setFee] = useState(0);

  const [clue, setClue] = useState(false);
  const [count, setCount] = useState(false);

  useEffect(() => {
    if (!txVisible && count) {
      setTimeout(() => {
        checkExistingAccount(receiver);
      }, 401);
    }
  }, [txVisible]);

  const resetInput = () => {
    setReceiver('');
    setAmount('');
  }

  useEffect(() => {
    const tempData = get(walletResource, 'urc20', []);
    const currentSelected = find(tempData, item => {
      return item.key === selectedCurrency?.key;
    });
    setSelectedCurrency(currentSelected);
  }, [walletResource]);

  useEffect(() => {
    if (isNaN(amount) || amount <= 0 || receiver.trim().length == 0) {
      setDisabled(true);
    } else {
      if (selectedCurrency?.key === CUSTOMIZE.token_name) {
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

  const getFee = (type, fee, decimals) => {
    switch (type) {
      case 'native':
        return 0.000267
      case 'urc20':
      case 'urc30':
        return fee / (10 ** decimals)
      default:
        return 0
    }
  }

  const handleSendCoin = async () => {
    dispatch({ type: PWD_MODAL_LOADING_ENABLE });
    await setError(null);
    try {
      const privateKey = await decrypt(encryptedPrivateKey, pwd);
      setCount(true);
      if (privateKey) {
        dispatch(
          actSendUrc20Token({
            address: selectedCurrency?.address,
            owner_address: unwAddress,
            to: receiver,
            amount: (amount * 10 ** get(selectedCurrency, 'decimals', 0)).toString(),
            available_time: future ? new Date(expiredTime).getTime() : undefined,
            privateKey,
          }),
        );
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
    if (selectedCurrency?.key === CUSTOMIZE.token_name) {
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
          <View
            // onPress={() => setTokenShown(true)}
            style={styles.currencyContainer}>
            <Image
              source={
                selectedCurrency?.key === CUSTOMIZE.token_name
                  ? CUSTOMIZE.token_icon
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
                  {/* {selectedCurrency?.value} */}
                  {helpers.formatAmount(helpers.formatNumberWithDecimals(get(selectedCurrency, 'value', 0), get(selectedCurrency, 'decimals', 0)))}
                </SemiBoldText>
              </View>
            </View>
          </View>

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
          <View style={{ marginTop: 8, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
            <ThinText
              style={{
                fontSize: 13,
                color: '#525B6B',
              }}>
              <Text style={{ color: '#9D9E9F' }}>Min: </Text>
              <Text style={{ fontWeight: '500' }}>
                {' '}
                {selectedCurrency?.key === 'UNW' ? '1' : get(selectedCurrency, 'lot', 1)}{' '}
                {selectedCurrency?.key}
              </Text>
            </ThinText>
            <ThinText
              style={{
                fontSize: 13,
                color: '#525B6B',
              }}>
              <Text style={{ color: '#9D9E9F' }}>Fee: </Text>
              <Text style={{ fontWeight: '500' }}>
                {' '}
                {/* {selectedCurrency?.key === 'UNW' ? '0,000267' : fee}{' '} */}
                {getFee('urc20', get(selectedCurrency, 'fee', 0), get(selectedCurrency, 'decimals', 0))}{' '}
                {selectedCurrency?.key}
              </Text>
            </ThinText>
          </View>
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
