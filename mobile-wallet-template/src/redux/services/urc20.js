/* eslint-disable no-throw-literal */
import axios from 'axios'
import {
    FETCH_TOKEN,
    CREATE_TOKEN,
    URC20_TRANSFER_FROM,
    URC20_TRANSFER,
    URC20_APPROVE,
    URC20_BURN,
    URC20_MINT,
    URC20_EXCHANGE,
    URC20_TRANSFER_OWNER,
    URC20_CONTRIBUTE_POOL_FEE,
    URC20_UPDATE_PARAMS,
    URC20_WITHDRAW_FUTURE,
    URC20_FUTURE_GET,
} from '../../config/api-config'
import { MESSAGES } from '../../config/constants'

import {
    signedTx,
    sendRawTx,
} from './unichain'

/**
 *  symbol,
 *  name,
 *  decimals,
 *  max_supply,
 *  total_supply,
 *  start_time,
 *  end_time,
 *  url,
 *  fee,
 *  extra_fee_rate,
 *  fee_pool,
 *  burned,
 *  latest_operation_time,
 *  lot,
 *  fee_pool_origin,
 *  exch_unx_num,
 *  exch_num,
 *  exch_enable,
 *  critical_update_time,
 *  create_acc_fee
 * @param {*} data
 * @param {*} privateKey
 * @returns
 */
export const create = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(CREATE_TOKEN, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

export const find = async (data) => {
    try {
        const resp = await axios.post(FETCH_TOKEN, data || {})
        return resp.data
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// from, to, address, amount, available_time
export const transferFrom = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_TRANSFER_FROM, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address, to, amount, available_time
export const transfer = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_TRANSFER, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address, spender, amount
export const approve = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_APPROVE, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address, amount
export const mint = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_MINT, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address, amount
export const burn = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_BURN, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// to_address, address
export const transferOwner = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_TRANSFER_OWNER, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address, amount
export const exchange = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_EXCHANGE, data)
        // console.log('unsignedData', unsignedData);
        const signedData = await signedTx(unsignedData.data, privateKey)
        // console.log('signedData', unsignedData);
        const txData = await sendRawTx(signedData)
        // console.log('txData', txData);
        return txData
    } catch (e) {
        console.log('eeeeee', e);
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address, amount
export const contributePoolFee = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_CONTRIBUTE_POOL_FEE, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address, fee, extra_fee_rate, lot, url, total_supply, fee_pool, exch_unx_num, exch_num, create_acc_fee
export const updateParams = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_UPDATE_PARAMS, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        console.log(e)
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address
export const withdrawFuture = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_WITHDRAW_FUTURE, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

// address
export const futureGet = async (data, privateKey) => {
    try {
        const unsignedData = await axios.post(URC20_FUTURE_GET, data)
        const signedData = await signedTx(unsignedData.data, privateKey)
        const txData = await sendRawTx(signedData)
        return txData
    } catch (e) {
        throw {
            message: e?.response?.data?.message || MESSAGES.ISSUE_TOKEN_FAILS,
        }
    }
}

