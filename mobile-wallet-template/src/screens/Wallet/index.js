import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { find, get, isEmpty } from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';
import io from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { WalletCard } from './components/WalletCard';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { TransactionItem } from './components/TransactionItem';
import { helpers } from '../../utils/helpers';
import {
  getAccountResource,
  getAllTransactions,
  getReward,
  withdrawReward,
} from '../../redux/services/unw';
import { Loading } from '../../components/Loading';
import {
  getWalletResource,
  updateUsdtPair,
  getWalletReward,
  getRewardSuccess,
} from '../../redux/actions/walletAction';
import { ActionPanel } from './components/ActionPanel';
import { WalletHeader } from './components/WalletHeader';
import { RegularText } from '../../components/CustomFontText/RegularText';
import { TokenAndTx } from './components/TokenAndTx';

import { ItalicText } from '../../components/CustomFontText/ItalicText';
import { ConfirmPwdModal } from '../../components/ConfirmPwdModal';
import { decrypt } from '../../utils/encrypt';
import { MESSAGES } from '../../config/constants';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { EmptyView } from '../../components/EmptyView';
import { AppButton } from '../../components/AppButton';
import { useDebounce } from '../../hook/useDebounce';
import { CONSTANTS, CUSTOMIZE, NETWORK_CONFIG } from '../../config/customize';

let interval;

const Wallet = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const alertRef = useRef();
  const unwAddress = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );

  const walletResource = useSelector((state) =>
    get(state, 'walletReducer.walletResource', null),
  );

  const usdtPair = useSelector((state) =>
    get(state, 'walletReducer.usdtPair', ''),
  );

  const encryptedPrivateKey = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  // reward
  const [rewardModal, setRewardModal] = useState(false);
  const [pwd, setPwd] = useState('');
  const [rewardLoading, setRewardLoading] = useState(false);
  const [rewardError, setRewardError] = useState(null);

  // modal
  const [txVisible, setTxVisible] = useState(null);

  const [socketData, setSocketData] = useState(null);
  const socketDataDebounce = useDebounce(socketData, 800);

  const getAccRes = async () => {
    if (unwAddress) {
      const resResource = await getAccountResource(unwAddress);
      const resReward = await getReward(unwAddress);
      dispatch(getWalletResource(resResource));
      if (resReward.status) {
        dispatch(getWalletReward(resReward.data));
      }
    }
  };

  useEffect(() => {
    async function getUnwWalletBalance() {
      await setLoading(true);
      getAccRes();
      await setLoading(false);
    }
    getUnwWalletBalance();
    getTransactionHistory();

    interval = setInterval(() => {
      getAccRes();
      getTransactionHistory();
    }, 30000);

    // socket
    const socket = io(NETWORK_CONFIG.UNI_SCAN_URL, {
      reconnection: true,
      reconnectionDelay: 5000,
      jsonp: false,
      reconnectionAttempts: 20,
      transports: ['websocket'],
    });
    socket.on('SUBSCRIBE_BIBOX_MARKET', (data) => {
      setSocketData(get(data, 'data.last', 0));
    });
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    if (socketDataDebounce) {
      dispatch(updateUsdtPair(socketDataDebounce));
    }
  }, [socketDataDebounce]);

  const getTransactionHistory = async () => {
    try {
      setTxLoading(true);
      const result = await getAllTransactions(unwAddress);
      if (get(result, 'data', null)) {
        setTransactionHistory(result.data);
      }
      setTxLoading(false);
    } catch (error) {
      setTxLoading(false);
    }
  };

  const onRefresh = async () => {
    await setRefreshing(true);
    await getAccRes();
    await getTransactionHistory();
    await setRefreshing(false);
  };

  const renderEmpty = () => {
    if (txLoading) {
      return (
        <ActivityIndicator
          animating={true}
          color={blackColor(0.4)}
          size="large"
          style={{ alignSelf: 'center', marginTop: 20 }}
        />
      );
    }
    return (
      <EmptyView />
    );
  };

  const handleGetReward = async () => {
    await setRewardLoading(true);
    await setRewardError(null);
    try {
      const privateKey = await decrypt(encryptedPrivateKey, pwd);
      if (privateKey) {
        const result = await withdrawReward({
          address: unwAddress,
          privateKey,
        });
        if (result && result.status) {
          await setRewardLoading(false);
          await setPwd('');
          await setRewardModal(false);
          dispatch(
            getRewardSuccess(
              Number(get(walletResource, 'reward', 0)),
            ),
          );
          setTimeout(() => {
            if (alertRef) {
              alertRef.current.alertWithType(
                'success',
                'Success',
                `Get ${Number(
                  get(walletResource, 'reward', 0),
                )} ${CUSTOMIZE.token_name} reward success!`,
              );
            }
          }, 401);
          getTransactionHistory();
          setTimeout(() => {
            if (getTransactionHistory) {
              getTransactionHistory();
            }
          }, 15000);
        } else {
          setRewardError(helpers.handleError(result?.error));
          await setRewardLoading(false);
        }
      } else {
        setRewardError(MESSAGES.PASSWORD_INCORRECT);
        await setRewardLoading(false);
      }
    } catch (error) {
      setRewardError(MESSAGES.INVALID_ADDRESS);
      await setRewardLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 10 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <WalletHeader usdtPair={usdtPair} navigation={navigation} />

        <View style={{ flex: 1, marginTop: 10 }}>
          <FlatList
            style={{
              flex: 1,
              marginBottom: 15,
            }}
            data={transactionHistory ? transactionHistory.slice(0, 100) : []}
            initialNumToRender={10}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListHeaderComponent={
              <View>
                <WalletCard
                  unwAddress={unwAddress}
                  resource={find(walletResource?.token, asset => asset.key === CUSTOMIZE.token_name)}
                  futureResource={find(walletResource?.token_future, asset => asset.key === CUSTOMIZE.token_name)}
                  // balance={get(walletResource, 'token', 0)}
                  // locked={get(walletResource, 'lock', 0)}
                  // future={get(walletResource, 'future_supply.total_balance', 0)}
                  // energyLocked={get(walletResource, 'energy_lock', null)}
                  // usdtPair={usdtPair}
                />
                <ActionPanel
                  navigation={navigation}
                  getTransactionHistory={getTransactionHistory}
                  setRewardModal={setRewardModal}
                />
                <TokenAndTx
                  unwAddress={unwAddress}
                  getTransactionHistory={getTransactionHistory}
                  txLoading={txLoading}
                />
                <ItalicText
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    color: '#A4A4A4',
                  }}>
                  {helpers.getCurrentDate()}
                </ItalicText>
              </View>
            }
            ListEmptyComponent={renderEmpty}
            renderItem={({ item, index }) => {
              return (
                <TransactionItem
                  item={item}
                  index={index}
                  positive={index % 2}
                  unwAddress={unwAddress}
                  setTxVisible={setTxVisible}
                  owner={unwAddress}
                />
              );
            }}
            keyExtractor={(item, index) => index + 'history_transaction_item'}
            ListFooterComponent={() => {
              if (transactionHistory?.length <= 100) return null;
              return (
                <AppButton
                  handleAction={() => {
                    helpers._handleLink(
                      `https://explorer.unichain.world/address-detail/${unwAddress}`,
                    )
                  }}
                  style={{ alignSelf: 'center', marginTop: 25 }}
                  text='View all on UniScan'
                />
              );
            }}
          />
        </View>
      </SafeAreaView>
      <ConfirmPwdModal
        label="Enter your password to get reward"
        visible={rewardModal}
        setVisible={setRewardModal}
        pwd={pwd}
        setPwd={setPwd}
        handleAction={handleGetReward}
        error={rewardError}
        setError={setRewardError}
        loading={rewardLoading}
        setLoading={setRewardLoading}
      />
      <TransactionDetailModal
        visible={txVisible}
        onDismiss={() => setTxVisible(null)}
      />
      {loading && <Loading />}
      <DropdownAlert ref={alertRef} />
    </View>
  );
};

export default Wallet;
