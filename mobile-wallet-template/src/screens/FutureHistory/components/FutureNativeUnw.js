import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Text
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';

import { AppButton } from '../../../components/AppButton';

import { blackColor } from '../../../utils/colorHelper';
import { helpers } from '../../../utils/helpers';
import { fetchListFutureCoin, withdrawFutureTransaction } from '../../../redux/services/unw';
import { get } from 'lodash';
import { ITEM_PER_PAGE, MESSAGES } from '../../../config/constants';
import { FutureNativeCoinItem } from './FutureNativeCoinItem';
import { EmptyView } from '../../../components/EmptyView';
import { ListFooterComponent } from '../../../components/LoadingFooter';
import { REQUEST_GET_ACCOUNT_RESOURCE } from '../../../redux/actions/types';
import { ConfirmPwdModal } from '../../../components/ConfirmPwdModal';
import { decrypt } from '../../../utils/encrypt';
import { CONSTANTS } from '../../../config/customize';

let stopFetchMore = true;

const FutureNativeUnw = ({ keyExtract, ...props }) => {

    const dispatch = useDispatch();
    const alertRef = useRef();

    const unwAddress = useSelector((state) =>
        get(state, 'walletReducer.walletInfo.unwAddress', null),
    );
    const encryptedPrivateKey = useSelector((state) => get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),);

    const [curPage, setCurPage] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [data, setData] = useState([]);
    const [available, setAvailable] = useState(0);
    const [count, setCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [visible, setVisible] = useState(false);
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        handleFetchFutureNativeCoin(0);
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            let availableTemp = 0
            data.forEach((el) => {
                if (el.expire_time < new Date().getTime()) {
                    availableTemp += el.future_balance
                }
            })
            setAvailable(availableTemp)
        }
    }, [data]);

    const handleFetchFutureNativeCoin = (page, loadMore = false) => {
        fetchListFutureCoin(unwAddress, ITEM_PER_PAGE, page)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    if (loadMore) {
                        setData(prev => [...prev, ...get(res, 'data.deals', [])])
                    } else {
                        setData(get(res, 'data.deals', []));
                    }
                    setTotalPage(helpers.getTotalPage(res.data.total_deal))
                }
            })
            .catch(err => {
                setLoading(false);
            })
    }

    const onRefresh = async () => {
        await setRefreshing(true);
        setCurPage(0);
        await handleFetchFutureNativeCoin(0);
        await setRefreshing(false);
    };

    const handleOnEndReached = async () => {
        setLoadingMore(true);
        if (!stopFetchMore && curPage < totalPage) {
            handleFetchFutureNativeCoin(curPage + 1, true);
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

    const handleClaimNativeFuture = async () => {
        await setError(null);
        try {
            const privateKey = await decrypt(encryptedPrivateKey, pwd);
            if (privateKey) {
                const res = await withdrawFutureTransaction({
                    owner_address: unwAddress,
                    privateKey
                });
                if (res.result) {
                    dispatch({
                        type: REQUEST_GET_ACCOUNT_RESOURCE,
                        data: unwAddress
                    });
                    setVisible(false);
                    setCurPage(0);
                    handleFetchFutureNativeCoin(0);
                    setTimeout(() => {
                        setCurPage(0);
                        handleFetchFutureNativeCoin(0);
                    }, 1000);
                    alertRef.current.alertWithType(
                        'success',
                        'Successful!',
                        `${MESSAGES.WITHDRAW_SUCCESS}`,
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
                <AppButton
                    text={`Claim (${helpers.formatNumber(available)} ${CONSTANTS.CURRENCY})`}
                    style={styles.claimBtn}
                    textStyle={styles.claimTxt}
                    handleAction={() => setVisible(true)}
                    disabled={available <= 0}
                />
            </View>
            <FlatList
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                onRefresh={onRefresh}
                refreshing={refreshing}
                data={data}
                renderItem={({ item, index }) => {
                    return <FutureNativeCoinItem item={item} index={index} positive={index % 2} />;
                }}
                keyExtractor={(item, index) =>
                    index + 'transaction_native_item'
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
                handleAction={handleClaimNativeFuture}
                error={error}
                setError={setError}
            />
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
    btn: {
        alignSelf: 'center',
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2
    },
    claimBtn: {
        alignSelf: 'baseline',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8
    },
    claimTxt: {
        fontSize: 14
    },
    dropdown: {
        backgroundColor: 'white',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginTop: 20,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});

export default FutureNativeUnw;
