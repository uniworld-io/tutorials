import Unichain from '@uniworld/unichain-js';
import axios from 'axios';
import { find, get } from 'lodash';
import ApiConfig from '../../config/api-config';
import { ACTION_TOKEN_BY_NATIVE_UNW, ACTION_TOKEN_MAPPING } from '../../config/constants';
import { walletUtils } from '../../utils/walletHelpers';
import * as urc20Api from '../../redux/services/urc20';
import { apiClient } from './client';

//initiate unichainjs
// const unichainNetwork = 'https://node.unichain.world';
// const relayHost = 'https://relay-node.unichain.world';
const unichainNetwork = ApiConfig.BASE_URL;
const relayHost = ApiConfig.RELAY_NODE;

const unichain = new Unichain({
  fullHost: unichainNetwork,
  solidityNode: relayHost,
});

unichain.isConnected((err, data) => {
  // console.log(err, data);
});

/**
 * Send UNW
 * @param {Object} params 
 */
export const sendUNW = async (params) => {
  if (params["from_address"] == params["to_address"]) {
    //cannot send to your own address
    return 'Fail, cannot return to your own address'
  }
  const amount = parseInt(params["amount"]);

  const data = {
    to_address: unichain.address.toHex(params["to_address"]),
    owner_address: unichain.address.toHex(params["from_address"]),
    amount: amount
  }
  let unsingedTx = await unichain.currentProviders().fullNode.request('wallet/createtransaction', data, 'post');
  // let unsingedTx = await apiClient.post('wallet/createtransaction', data);
  // debugger
  let signedTx = await unichain.unx.signTransaction(unsingedTx, params["private_key"], 0)
  let res = await unichain.unx.sendRawTransaction(signedTx);
  // debugger
  return res;
}

export const sendTokenUNW = async (data) => {
  return createAndSendV2(
    `${ApiConfig.TRANSFER_TOKEN}`, {
    owner_address: Unichain.address.toHex(data.owner_address),
    to_address: Unichain.address.toHex(data.to_address),
    token_name: data.token_name,
    amount: data.amount,
    available_time: data.available_time,
  },
    data.privateKey,
  )
}


const createAndSend = async (url, data, privateKey) => {
  try {
    const unsingedTxObj = await axios.post(url, data);
    const unsingedTx = unsingedTxObj.data;
    const signedTx = await unichain.unx.signTransaction(
      unsingedTx,
      privateKey,
      0
    );
    const res = await unichain.unx.sendRawTransaction(signedTx);
    return unsingedTxObj.data;
  } catch (err) {
    console.log(err);
    return {
      status: false,
    };
  }
};

/////future transfer & withdraw fund/////////////
export const futureTransfer = async (params) => {
  const data = {
    owner_address: Unichain.address.toHex(params["owner_address"]),
    to_address: Unichain.address.toHex(params["to_address"]),
    amount: params["amount"],
    expire_time: new Date(params["expire_time"]).getTime(),
    privateKey: params["privateKey"],
  };
  try {
    return await createAndSend(
      `${ApiConfig.BASE_URL}${ApiConfig.SEND_FUTURE}`,
      data,
      params["privateKey"]
    );
  } catch (error) {
    console.log(error);
  }
};

const createAndSendV2 = async (url, data, privateKey) => {
  // console.log('createAndSendV2 data', data);
  const unsingedTxObj = await axios.post(url, data);
  const unsingedTx = unsingedTxObj.data;
  // console.log('====unsingedTx', unsingedTx);
  try {
    const signedTx = await unichain.unx.signTransaction(
      unsingedTx,
      privateKey,
      0
    );
    // console.log('signedTx', signedTx);
    return await unichain.unx.sendRawTransaction(signedTx);
  } catch (err) {
    // console.log('errrrrr', err);
    return {
      status: false,
      message: unsingedTxObj.data,
    };
  }
};

export function transferToken(data) {
  return createAndSendV2(
    `${ApiConfig.BASE_URL}${ApiConfig.TRANSFER_TOKEN}`,
    {
      owner_address: Unichain.address.toHex(data["owner_address"]),
      to_address: Unichain.address.toHex(data["to_address"]),
      token_name: data.token_name,
      amount: data.amount,
      available_time: data.available_time,
    },
    data.privateKey
  );
}

/**
 * Send future UNW
 * @param {Object} params
 */
export const handleSendFuture = async (body) => {
  return apiClient.post(ApiConfig.SEND_FUTURE, body);
};

export const getAllTransactions = (address) => {
  return axios.get(`${ApiConfig.BASE_EXPLORER_URL}${ApiConfig.GET_ALL_TRANSACTION}/${address}`, {});
};

/**
 * Check string is unw wallet
 * @param {String} address
 */
export const isUnwAddress = (address) => {
  return Unichain.isAddress(address);
};

/**
 * Issue UNW Token
 * @param {Oject} params
 */
export const issueToken = async (params) => {
  const data = {
    owner_address: Unichain.address.toHex(params.owner_address),
    name: params.name,
    abbr: params.abbr,
    max_supply: params.max_supply,
    total_supply: params.total_supply,
    start_time: params.start_time,
    end_time: params.end_time,
    description: params.description,
    url: params.url,
    fee: params.fee,
    extra_fee_rate: params.extra_fee_rate,
    fee_pool: params.fee_pool,
    lot: params.lot,
    create_acc_fee: params.create_acc_fee,
    exch_num: params.exch_num,
    exch_unx_num: params.exch_unx_num,
  }
  const t = await createAndSendV2(
    `${ApiConfig.BASE_URL}/wallet/createtoken`,
    data,
    params.privateKey,
  )
  return t
  // try {
  //   const unsingedTx = await unichain.transactionBuilder.createToken(
  //     params['tokenSpec'],
  //     params['ownerAddress'],
  //   );
  //   const signedTx = await unichain.unx.signTransaction(
  //     unsingedTx,
  //     params['privateKey'],
  //     0,
  //   );
  //   // const unsingedTx = await unichain.transactionBuilder.createToken(params["tokenSpec"], "UP4DP51jR2U5n5XaoaxKQ9TG2kvmh3Cy8X")
  //   // const signedTx = await unichain.unx.signTransaction(unsingedTx, "f0d5eae0528dbc3378336c1657004150415ccf535d55b83cb6b22c81433b66a1", 0)
  //   const data = await unichain.unx.sendRawTransaction(signedTx);
  //   debugger;
  //   return {
  //     status: true,
  //     data: data,
  //   };
  // } catch (error) {
  //   return {
  //     status: false,
  //     data: error.toString(),
  //   };
  // }
};

/**
 * Issue UNW Token
 * @param {Oject} params
 */
export const issueTokenV2 = async (body) => {
  return apiClient.post(`/wallet/createtoken`, body);
};

/**
 * Get UNW Token issue by Address
 * @param {String} address
 */
export const getUNWTokenByAddress = async (address) => {
  try {
    return await unichain.unx.getTokensIssuedByAddress(address);
  } catch (error) {
    // console.log(error);
    return {};
  }
};

/**
 *
 * @param {Object} data //offset, limit use paging
 */
export const getListUnwTokens = async (data) => {
  try {
    // const results = await  unichain.unx.get(address);
    const limit = (data && data.limit) || 10;
    const offset = (data && data.offset) || 0;
    const results = await unichain.unx.listTokens(limit, offset);
    // console.log(results);
    return results;
  } catch (error) {
    // console.log('----as-a-sas', error);
    return [];
  }
};
/**
 *
 * @param {String} ID : id of token
 */
export const getTokenByID = async (ID) => {
  try {
    return await unichain.unx.getTokenFromID(ID);
  } catch (error) {
    return null;
  }
};

/**
 *
 * @param {String} address : UNW address
 */
export const getAccountResource = async (address) => {
  try {
    const results = await apiClient.post(`/wallet/getaccount`, {
      address: unichain.address.toHex(address)
    });
    console.log('ssssss', results);
    //list token 
    let listTokens = []
    if (results["asset"] && results["asset"].length > 0) {
      for (const iterator of results["asset"]) {
        const token = await getTokenByID(iterator.key)
        iterator.symbol = token["abbr"];
        iterator.id = token["id"];
        listTokens.push(iterator)
      }
    }

    //unw lock
    let lockedTotal = 0;
    if (get(results, 'frozen', null)) {
      const now = Date.now()
      results["frozen"].forEach(item => {
        lockedTotal += item["frozen_balance"]
      });
    }

    //unw vote
    let votes = 0;
    if (results["votes"]) {
      results["votes"].forEach(item => {
        votes += item["vote_count"]
      });
    }

    // urc20
    let urc20 = [];
    const tempUrc20 = results['urc20'];
    if (tempUrc20 && tempUrc20.length > 0) {
      const requests = []
      tempUrc20.forEach((item) => {
        requests.push(urc20Api.find({ address: walletUtils.unwAddressToHex(item.key) }))
      })
      const tokens = await Promise.all(requests)
      const temp = tokens.map((item) => {
        const tempValue = find(tempUrc20, (urc20Item => urc20Item.key === walletUtils.hexToUnwAddress(get(item, 'contracts[0].address', ''))));
        console.log('tempValue', tempValue);
        return ({
          ...item?.contracts[0],
          value: tempValue?.value,
          key: item?.contracts[0]?.symbol,
          type: 'urc20'
        })
      })
      urc20 = temp;
    }

    return {
      status: true,
      balance: get(results, 'balance', 0), // locked, future, current balance
      listTokens: listTokens,
      lock: lockedTotal,
      vote_count: votes,
      token: results.token,
      urc20,
      future_supply: results.future_supply,
      token_future: results.token_future ? results.token_future : []
    }
  } catch (error) {
    console.log('errr', error);
    return {
      status: false,
      balance: 0,
      listTokens: [],
      lock: 0,
      vote_count: 0,
      token: [],
      urc20: [],
      future_supply: [],
      lock: 0,
      token_future: []
    }
  }
};

// Buy UNW Token
export const handleActionToken = async ({
  action,
  tokenName,
  amount,
  buyerAddress,
  privateKey,
}) => {
  const data = {
    owner_address: unichain.address.toHex(buyerAddress),
    amount: ACTION_TOKEN_BY_NATIVE_UNW.includes(action) ? toUNW(amount) : amount,
    token_name: tokenName,
  }
  console.log(data)
  try {
    const unsingedTx = await unichain
      .currentProviders()
      .fullNode.request(ACTION_TOKEN_MAPPING[action], data, 'post')
    const signedTx = await unichain.unx.signTransaction(
      unsingedTx,
      privateKey,
      0,
    )
    return await unichain.unx.sendRawTransaction(signedTx)
  } catch (error) {
    return error.message;
  }
}


/**
 * Get unw reward
 * @param {String} address
 */
export const getReward = async (address) => {
  // console.log('unichain.address.toHex(address)', unichain.address.toHex(address));
  try {
    const result = await apiClient.get(`/wallet/getReward`, {
      params: {
        address: unichain.address.toHex(address)
      }
    });
    // const result = await apiClient.get(`/wallet/getReward?address=UgeiE8HHrxbwwEkGhorxXcqGGEb1zf9G2z`);
    // console.log('la sao t', result);
    return {
      status: true,
      data: result.reward
    }
  } catch (error) {
    return {
      status: false,
      error: error
    }
  }
};
/**
 * WithDraw reward
 * @param {String} address
 * @param {String} witnessPrivateKey
 */
export const withdrawReward = async ({ address, privateKey }) => {
  try {
    let owner_address = unichain.address.toHex(address)
    let unsingedTx = await unichain.transactionBuilder.withdrawBlockRewards(owner_address)
    let signedTx = await unichain.unx.signTransaction(unsingedTx, privateKey, 0)
    let res = await unichain.unx.sendRawTransaction(signedTx)
    return {
      status: true,
      data: res
    }
  } catch (error) {
    console.log('asasasasas', error);
    return {
      status: false,
      error: error
    }
  }
};

const toUNW = (ginza) => ginza * 1000000;
export const lockUNW = async ({
  ginza,
  voter_address,
  voter_privateKey,
}) => {
  try {
    let unsingedTx = await unichain.transactionBuilder.freezeBalance(
      toUNW(ginza),
      3,
      "BANDWIDTH",
      voter_address,
    );

    // console.log("lockBalance unsingedTx :", unsingedTx);
    let signedTx = await unichain.unx.signTransaction(
      unsingedTx,
      voter_privateKey,
      0,
    );
    return await unichain.unx.sendRawTransaction(signedTx);
  } catch (error) {
    // console.log(error);
    return {
      status: false,
      message: error,
    };
  }
};

export const unlockUnw = async ({
  ownerAddress,
  privateKey,
  type = 'BANDWIDTH',
}) => {
  try {
    let unsingedTx = await unichain.transactionBuilder.unfreezeBalance(
      type,
      ownerAddress,
    );
    // console.log('lockBalance unsingedTx :', unsingedTx)
    let signedTx = await unichain.unx.signTransaction(
      unsingedTx,
      privateKey,
      0,
    );
    let res = await unichain.unx.sendRawTransaction(signedTx);
    // console.log('coin transaction: ', res)

    return res;
  } catch (error) {
    // console.log(error);
    return {
      result: false,
      error: error,
    };
  }
};

/**
 * =====================WITNESS=========================
 */
/**
 * Get all WITNESS IN CHAIN
 */
export const getListWitness = async () => {
  try {
    const res = await axios.get(`${ApiConfig.BASE_EXPLORER_URL}/witness`);
    return res.data.data;
    //    return results
  } catch (error) {
    // console.log(error);
    return [];
  }
};

/**
 * Apply for witness
 */
export const applyForWitness = async ({
  witnessAddress,
  url,
  witnessPrivateKey,
}) => {
  try {
    let unsingedTx = await unichain.transactionBuilder.applyForWitness(
      '44928334a7dc2ca5b9d8ac939e02c64b344215ca25',
      url,
    );
    let signedTx = await unichain.unx.signTransaction(
      unsingedTx,
      witnessPrivateKey,
      0,
    );
    let res = await unichain.unx.sendRawTransaction(signedTx);
    return {
      status: true,
      data: res,
    };
  } catch (error) {
    // console.log(error);
    return {
      status: false,
      message: error.toString(),
    };
  }
};

/**
 * Vote for witness
 * @param {Object} param0
 */
export const voteForWitness = async ({
  voteCount,
  witnessAddress,
  voterPrivateKey,
  voterAddress,
}) => {
  try {
    let witnessToVote = {
      [witnessAddress]: voteCount,
    };
    let unsingedTx = await unichain.transactionBuilder.vote(
      witnessToVote,
      voterAddress,
    );
    let signedTx = await unichain.unx.signTransaction(
      unsingedTx,
      voterPrivateKey,
      0,
    );
    return await unichain.unx.sendRawTransaction(signedTx);
  } catch (error) {
    // console.log(error);
    return {
      status: false,
      message: error,
    };
  }
};

export const getTokenByAccount = (data) => {
  const address = unichain.address.toHex(data);
  // console.log('========', address);
  return apiClient.post(
    '/wallet/getassetissuebyaccount',
    { address },
    ApiConfig.BASE_URL,
  );
};

export const fetchListFutureTokenTransfer = (data) => {
  return axios.post(`${ApiConfig.BASE_URL}${ApiConfig.LIST_FUTURE_TOKEN_TRANSFER}`, {
    owner_address: unichain.address.toHex(data.owner_address),
    token_name: data.token_name,
    page_size: data.page_size,
    page_index: data.page_index,
  })
}

export const fetchListFutureCoin = (
  owner_address,
  page_size = 10,
  page_index = 1,
) => {
  return axios.post(
    `${ApiConfig.BASE_URL}${ApiConfig.LIST_FUTURE_COIN}`, {
    owner_address: Unichain.address.toHex(owner_address),
    page_size,
    page_index,
  },
  )
}

export function withdrawFutureTransaction(data) {
  return createAndSendV2(
    `${ApiConfig.BASE_URL + ApiConfig.WITHDRAW_FUTURE_TRANSACTIONS}`, {
    owner_address: Unichain.address.toHex(data.owner_address),
  },
    data.privateKey,
  )
}

export function withdrawFutureToken(data) {
  return createAndSendV2(
    `${ApiConfig.BASE_URL + ApiConfig.WITHDRAW_FUTURE_TOKEN}`, {
    owner_address: Unichain.address.toHex(data.to_address),
    token_name: data.token_name,
  },
    data.privateKey,
  )
}

