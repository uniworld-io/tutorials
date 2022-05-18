import { get } from 'lodash';
import { put, call } from 'redux-saga/effects';
import { MESSAGES } from '../../config/constants';
import { helpers } from '../../utils/helpers';
import { GET_ACCOUNT_RESOURCE_SUCCESS, PWD_MODAL_LOADING_DISABLE, REQUEST_GET_ACCOUNT_RESOURCE, SEND_UNW_TOKEN_FAIL, TX_STATUS_MODAL_SHOW, TX_STATUS_MODAL_SHOW_ERROR } from '../actions/types';
import { futureTransfer, getAccountResource, issueToken, isUnwAddress, sendTokenUNW, sendUNW, transferToken } from '../services/unw';

//GET BALANCE UNW
export function* handleGetResourceAccount(action) {
    const address = action.data;
    if (!isUnwAddress(address)) {
        return;
    }
    const accountResource = yield call(getAccountResource, address);

    if (accountResource.status) {
        yield put({
            type: GET_ACCOUNT_RESOURCE_SUCCESS,
            data: accountResource
        })
    }
}

export function* actSendNativeUnw(action) {
    const params = action.data;
    const amountUNW = params["amount"] * 10 ** 6;
    try {
        const res = yield call(sendUNW, {
            to_address: params["to_address"],
            from_address: params["from_address"],
            amount: amountUNW,
            private_key: params["private_key"]
        });
        yield put({ type: PWD_MODAL_LOADING_DISABLE });
        if (res["result"]) {
            const { txID } = res["transaction"];

            yield put({
                type: TX_STATUS_MODAL_SHOW,
                data: txID
            });

            yield put({
                type: REQUEST_GET_ACCOUNT_RESOURCE,
                data: params["from_address"]
            });

        } else {
            yield put({
                type: TX_STATUS_MODAL_SHOW_ERROR,
                data: helpers.handleError(get(res, 'error', ''))
            })
        }

    } catch (error) {
        console.log(error);
        yield put({ type: PWD_MODAL_LOADING_DISABLE });
        yield put({
            type: TX_STATUS_MODAL_SHOW_ERROR,
            data: MESSAGES.NORMAL_ERROR
        })
    }
}

// Send Token
export function* handleTransferToken(action) {
    const params = action.data;
    try {
        const res = yield call(transferToken, params);
        yield put({ type: PWD_MODAL_LOADING_DISABLE });

        if (res.result) {
            const { transaction } = res
            const { txID } = transaction

            yield put({
                type: TX_STATUS_MODAL_SHOW,
                data: txID
            });
            yield put({
                type: REQUEST_GET_ACCOUNT_RESOURCE,
                data: params["owner_address"]
            });

        } else {
            yield put({
                type: TX_STATUS_MODAL_SHOW_ERROR,
                data: helpers.handleError(get(res, 'message.Error', ''))
            })
        }

    } catch (error) {
        console.log(error);
        yield put({ type: PWD_MODAL_LOADING_DISABLE });
        yield put({
            type: TX_STATUS_MODAL_SHOW_ERROR,
            data: MESSAGES.NORMAL_ERROR
        })
    }
}

export function* handleSubmitCreateToken(action) {
    const {
        owner_address, name, abbr, max_supply, total_supply, start_time, end_time, description, url, fee, extra_fee_rate, fee_pool, lot, exch_num, exch_unx_num, privateKey, create_acc_fee
        // fetchLisTokens,
        // fetchTokenByAccount
    } = action.data

    try {
        const results = yield call(issueToken, {
            owner_address,
            name,
            abbr,
            max_supply,
            total_supply,
            start_time,
            end_time,
            description,
            url,
            fee,
            extra_fee_rate,
            fee_pool,
            lot,
            exch_num,
            exch_unx_num,
            create_acc_fee,
            privateKey,
            // fetchLisTokens,
            // fetchTokenByAccount
        })

        // console.log('results====', results);

        yield put({ type: PWD_MODAL_LOADING_DISABLE });

        if (results.result) {
            const { transaction } = results
            const { txID } = transaction

            yield put({
                type: TX_STATUS_MODAL_SHOW,
                data: txID
            });
            yield put({
                type: REQUEST_GET_ACCOUNT_RESOURCE,
                data: owner_address
            });

            // fetchLisTokens();
            // fetchTokenByAccount();

        } else {
            yield put({
                type: TX_STATUS_MODAL_SHOW_ERROR,
                data: helpers.handleError(get(results, 'message.Error', ''))
            })
        }
    } catch (error) {
        // console.log('errrrr', error);
        yield put({ type: PWD_MODAL_LOADING_DISABLE });
        yield put({
            type: TX_STATUS_MODAL_SHOW_ERROR,
            data: MESSAGES.ISSUE_TOKEN_FAILS
        })
    }


}

// Send future
export function* handleSendUnwFutureAction(action) {

    const params = action.data;

    const amountUNW = params["amount"] * 10 ** 6;

    try {
        const res = yield call(futureTransfer, {
            to_address: params["to_address"],
            owner_address: params["owner_address"],
            amount: amountUNW,
            expire_time: params["expire_time"],
            privateKey: params["privateKey"],
        });
        yield put({ type: PWD_MODAL_LOADING_DISABLE });
        if (res) {

            yield put({
                type: TX_STATUS_MODAL_SHOW,
                data: res["txID"]
            });

            yield put({
                type: REQUEST_GET_ACCOUNT_RESOURCE,
                data: params["owner_address"]
            });
        } else {
            yield put({
                type: TX_STATUS_MODAL_SHOW_ERROR,
                data: helpers.handleError(get(res, 'message.Error', ''))
            })
        }

    } catch (error) {
        console.log(error);
        yield put({ type: PWD_MODAL_LOADING_DISABLE });
        yield put({
            type: TX_STATUS_MODAL_SHOW_ERROR,
            data: MESSAGES.NORMAL_ERROR
        })
    }
}

