import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import { get, isEmpty } from 'lodash';
import DropdownAlert from 'react-native-dropdownalert';

import { useDispatch, useSelector } from 'react-redux';
import { WalletCard } from './components/WalletCard';
import { InfoCard } from './components/InfoCard';
import { blackColor } from '../../utils/colorHelper';
import { TransactionItem } from './components/TransactionItem';
import images from '../../config/images';
import { helpers } from '../../utils/helpers';
import { SendUniModal } from '../../components/SendUniModal';
import { ConfirmUniModal } from '../../components/SendUniModal/ConfirmPwdModal';
import { WalletInfoModal } from '../../components/WalletInfoModal';
import { getAccountResource, getAllTransactions } from '../../redux/services/unw';
import { Loading } from '../../components/Loading';
import { getWalletResource } from '../../redux/actions/walletAction';
import { walletUtils } from '../../utils/walletHelpers';
import { Constants } from '../../config/constants';
import { ConfirmUnlockCoinModal } from './components/ConfirmUnlockCoinModal';
import { LockUNWModal } from './components/LockUNWModal';

const Home = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const alertRef = useRef();
  const unwAddress = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );

  const walletResource = useSelector((state) =>
    get(state, 'walletReducer.walletResource', null),
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [count, setCount] = useState(0);
  // lock/unlock coin
  const [unLockVisible, setUnlockVisible] = useState(false);
  const [lockVisible, setLockVisible] = useState(false);

  const [transactionInfo, setTransactionInfo] = useState({
    to_address: null,
    from_address: null,
    amount: 0,
    private_key: null,
  });

  const getAccRes = async () => {
    if (unwAddress) {
      const result = await getAccountResource(unwAddress);
      dispatch(getWalletResource(result));
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
  }, []);

  const getTransactionHistory = async () => {
    try {
      setTxLoading(true);
      const result = await getAllTransactions(unwAddress);
      if (result.status == 200) {
        setTransactionHistory(result.data);
      }
      setTxLoading(false);
    } catch (error) {
      // console.log('---error---', error);
      setTxLoading(false);
    }
  };

  // language
  // const [t, i18n] = useTranslation();
  // const changeLanguage = () => {
  //   if (i18n.language === 'fr') {
  //     i18n.changeLanguage('en');
  //   } else {
  //     i18n.changeLanguage('fr');
  //   }
  // };

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
      <Text
        style={{
          textAlign: 'center',
          alignItems: 'center',
          color: blackColor(0.7),
          marginTop: 20,
        }}>
        No transaction available
      </Text>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 15 }}
          style={{ flex: 1 }}>
          <WalletCard
            unwAddress={unwAddress}
            balance={get(walletResource, 'balance', 0)}
            visible={infoVisible}
            setVisible={setInfoVisible}
            setLockVisible={setLockVisible}
          />
          <View
            style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
            <Animatable.View
              animation="slideInLeft"
              style={{ flex: 1, marginRight: 20 }}>
              <InfoCard
                figure={
                  get(walletResource, 'balance', 0) +
                  get(walletResource, 'lock', 0)
                }
              />
            </Animatable.View>
            <Animatable.View animation="slideInRight" style={{ flex: 1 }}>
              <InfoCard
                figure={get(walletResource, 'lock', 0)}
                label="Locked"
                lock={get(walletResource, 'lock', 0) > 0}
                expire_time={get(walletResource, 'expire_time', 0)}
                setUnlockVisible={setUnlockVisible}
              />
            </Animatable.View>
          </View>

          {/* transaction history */}
          <Animatable.View animation="fadeInUp">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={styles.transaction}>Transaction</Text>
              <Pressable
                onPress={() =>
                  helpers._handleLink(
                    `https://explorer.unichain.world/address-detail/${unwAddress}`,
                  )
                }
                style={{ paddingVertical: 6, paddingLeft: 10 }}>
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                style={{
                  flex: 1,
                  marginTop: 15,
                  marginBottom: helpers.isIpX ? helpers.bottomSpace + 30 : 50,
                }}
                data={transactionHistory}
                ListEmptyComponent={renderEmpty}
                renderItem={({ item, index }) => {
                  return (
                    <TransactionItem
                      item={item}
                      index={index}
                      positive={index % 2}
                      unwAddress={unwAddress}
                    />
                  );
                }}
                keyExtractor={(item, index) =>
                  index + 'history_transaction_item'
                }
              />
            </View>
          </Animatable.View>
        </ScrollView>
        <Pressable
          onPress={() => setInfoVisible(true)}
          style={[styles.floatingBtn, { backgroundColor: '#3A3A3A' }]}>
          <Image
            source={images.income}
            style={{ tintColor: 'white', width: 30, height: 30 }}
          />
        </Pressable>
        <Pressable
          onPress={() => setVisible(true)}
          style={[styles.floatingBtn, { backgroundColor: '#CC393C', right: 90 }]}>
          <Image
            source={images.withdraw}
            style={{ tintColor: 'white', width: 30, height: 30 }}
          />
        </Pressable>
      </SafeAreaView>
      <SendUniModal
        visible={visible}
        setVisible={setVisible}
        setTransactionInfo={setTransactionInfo}
        count={count}
        handleContinue={() => {
          setVisible(false);
          setTimeout(() => {
            setShowConfirm(true);
          }, 500);
        }}
      />
      <ConfirmUniModal
        visible={showConfirm}
        setInputVisible={setVisible}
        setVisible={setShowConfirm}
        count={count}
        setCount={setCount}
        transactionInfo={transactionInfo}
        getTransactionHistory={getTransactionHistory}
      />
      <WalletInfoModal
        unwAddress={unwAddress}
        visible={infoVisible}
        setVisible={setInfoVisible}
      />
      <ConfirmUnlockCoinModal
        visible={unLockVisible}
        setVisible={setUnlockVisible}
        lock={get(walletResource, 'lock', 0)}
        unwAddress={unwAddress}
        getAccRes={getAccRes}
        getTransactionHistory={getTransactionHistory}
        alertRef={alertRef}
      />
      <LockUNWModal
        visible={lockVisible}
        setVisible={setLockVisible}
        lock={get(walletResource, 'lock', 0)}
        balance={get(walletResource, 'balance', 0)}
        unwAddress={unwAddress}
        getAccRes={getAccRes}
        getTransactionHistory={getTransactionHistory}
        alertRef={alertRef}
      />
      {loading && <Loading />}
      <DropdownAlert ref={alertRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  transaction: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: blackColor(0.7),
  },
  floatingBtn: {
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: helpers.isIpX ? helpers.bottomSpace : 15,
    right: 15,
  },
});

export default Home;
