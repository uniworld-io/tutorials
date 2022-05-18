import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  Text
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';

import { styles } from './styles';
import { blackColor, COLORS } from '../../../utils/colorHelper';
import { helpers } from '../../../utils/helpers';
import { FutureTxItem } from './FutureTxItem';
import { fetchListFutureTokenTransfer, withdrawFutureToken } from '../../../redux/services/unw';
import { get } from 'lodash';
import { ITEM_PER_PAGE, MESSAGES } from '../../../config/constants';
import { EmptyView } from '../../../components/EmptyView';
import { ListFooterComponent } from '../../../components/LoadingFooter';
import { ConfirmPwdModal } from '../../../components/ConfirmPwdModal';
import { decrypt } from '../../../utils/encrypt';
import { REQUEST_GET_ACCOUNT_RESOURCE } from '../../../redux/actions/types';
import { RegularText } from '../../../components/CustomFontText/RegularText';
import { Icon } from 'native-base';
import { BoldText } from '../../../components/CustomFontText/BoldText';
import { ModalTokenSelect } from './ModalTokenSelect';

let stopFetchMore = true;

const FutureToken = ({ keyExtract, ...props }) => {

  const dispatch = useDispatch();
  const alertRef = useRef();

  const unwAddress = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );
  const encryptedPrivateKey = useSelector((state) => get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),);
  const tokens = useSelector(state => get(state, 'walletReducer.walletResource.token_future', []));

  const [selectedToken, setSelectedToken] = useState(get(tokens, `[0]`, ''));
  const [curPage, setCurPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedToken) {
      setLoading(true);
      handleFetchFutureTokenTransfer(get(selectedToken, 'key', ''), 0);
      setCurPage(0);
    }
  }, [selectedToken]);

  const handleFetchFutureTokenTransfer = (token, page, loadMore = false) => {
    if (token) {
      fetchListFutureTokenTransfer({
        owner_address: unwAddress,
        token_name: token,
        page_size: ITEM_PER_PAGE,
        page_index: page,
      })
        .then(res => {
          setLoading(false);
          if (res.status === 200) {
            const listDeals = res.data.deals
            const newArr = listDeals.map((v) => ({ ...v, token_name: res.data.token_name }))
            if (loadMore) {
              setData(prev => [...prev, ...newArr])
            } else {
              setData(newArr)
            }
            setTotalPage(helpers.getTotalPage(res.data.total_deal))
          }
        })
        .catch(err => {
          console.log('errr', err, token);
          setLoading(false);
        });
    }
  }

  const onRefresh = async () => {
    await setRefreshing(true);
    setCurPage(0);
    await handleFetchFutureTokenTransfer(get(selectedToken, 'key', ''), 0);
    await setRefreshing(false);
  };

  const handleOnEndReached = async () => {
    setLoadingMore(true);
    if (!stopFetchMore && curPage < totalPage) {
      handleFetchFutureTokenTransfer(get(selectedToken, 'key', ''), curPage + 1, true);
      setCurPage(prev => prev + 1);
      setLoadingMore(false);
      stopFetchMore = true;
    }
    setLoadingMore(false);
  };

  const renderEmpty = () => {
    if (loading) {
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

  const handleClaimTokenFuture = async () => {
    await setError(null);
    try {
      const privateKey = await decrypt(encryptedPrivateKey, pwd);
      if (privateKey) {
        const res = await withdrawFutureToken({
          to_address: unwAddress,
          token_name: selectedToken.key,
          privateKey
        });
        if (res.result) {
          dispatch({
            type: REQUEST_GET_ACCOUNT_RESOURCE,
            data: unwAddress
          });
          setVisible(false);
          setCurPage(0);
          handleFetchFutureTokenTransfer(get(selectedToken, 'key', ''), 0);
          setTimeout(() => {
            setCurPage(0);
            handleFetchFutureTokenTransfer(get(selectedToken, 'key', ''), 0);
          }, 1000);
          alertRef.current.alertWithType(
            'success',
            'Successful!',
            `${MESSAGES.CLAIM_SUCCESS}`,
          );
        } else {
          setVisible(false);
          alertRef.current.alertWithType(
            'error',
            'Error!',
            String(helpers.handleError(get(res, 'message.Error', ''))).trim(),
          );
        }
      } else {
        setError(MESSAGES.WRONG_PWD);
      }
    } catch (error) {
      setVisible(false);
      alertRef.current.alertWithType(
        'error',
        'Error!',
        `${MESSAGES.NORMAL_ERROR}`,
      );
    }
  }

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <View style={styles.header}>
        <Pressable disabled={data.length === 0} onPress={() => setVisible(true)} style={[styles.claimBtn, data.length === 0 && { backgroundColor: '#939393' }]}>
          <BoldText style={styles.claimTxt}>Claim</BoldText>
        </Pressable>
        <Pressable onPress={() => setShowModal(true)} style={styles.selectBtn}>
          <RegularText style={{ fontSize: 14, }}>{get(selectedToken, 'key', 'Select Token')}</RegularText>
          <Icon
            name='down'
            type='AntDesign'
            style={{ fontSize: 15, color: COLORS.black, marginLeft: 5 }}
          />
        </Pressable>
      </View>
      <FlatList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={data}
        extraData={data}
        renderItem={({ item, index }) => {
          return <FutureTxItem item={item} index={index} positive={index % 2} />;
        }}
        keyExtractor={(item, index) =>
          index + 'transaction_future_item'
        }
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListFooterComponent={() => loadingMore && <ListFooterComponent />}
        ListEmptyComponent={renderEmpty}
      />
      <ConfirmPwdModal
        visible={visible}
        setVisible={setVisible}
        pwd={pwd}
        setPwd={setPwd}
        handleAction={handleClaimTokenFuture}
        error={error}
        setError={setError}
      />
      <ModalTokenSelect
        visible={showModal}
        setVisible={setShowModal}
        onSelect={setSelectedToken}
      />
      <DropdownAlert ref={alertRef} />
    </View >
  );
};

export default FutureToken;
