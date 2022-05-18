import * as types from './types';

export const fetchWalletInfo = (data) => {
  return {
    type: types.FETCH_WALLET_INFO_SUCCESS,
    data,
  };
};

export const decryptedPrivateKey = (data) => {
  return {
    type: types.DECRYPTED_PRIVATE_KEY,
    data,
  };
};

export const encryptedPrivateKey = (data) => {
  return {
    type: types.ENCRYPTED_PRIVATE_KEY,
    data,
  };
};

export const getWalletResource = (data) => {
  return {
    type: types.GET_ACCOUNT_RESOURCE_SUCCESS,
    data,
  };
};

export const getWalletReward = (data) => {
  return {
    type: types.GET_WALLET_REWARD,
    data,
  };
};

export const updateUsdtPair = (data) => {
  return {
    type: types.UPDATE_USDT_PAIR,
    data,
  };
};

export const handleEditBalanceResource = (data) => {
  return {
    type: types.HANDLE_EDIT_BALANCE,
    data,
  };
};

export const getRewardSuccess = (data) => {
  return {
    type: types.GET_REWARD_SUCCESS,
    data,
  };
};

export const updateVoteCount = (data) => {
  return {
    type: types.UPDATE_VOTE_COUNT,
    data,
  };
};

// lock/unlock coin success
export const handleUnlockUnwSuccess = (data) => {
  return {
    type: types.UNLOCK_UNW_SUCCESS,
    data,
  };
};

export const handleLockUnwSuccess = (data) => {
  return {
    type: types.LOCK_UNW_SUCCESS,
    data,
  };
};

export const handleLockEnergyUnwSuccess = (data) => {
  return {
    type: types.LOCK_ENERGY_UNW_SUCCESS,
    data,
  };
};

export const actSendNativeUNWFuture = (data) => {
  return {
      type: types.REQUEST_SEND_FUTURE,
      data
  }
}

export function actRequestTransferToken(data) {
  return {
      type: types.REQUEST_SUBMIT_TRANSFER_TOKEN,
      data
  }
}

export function actSendNativeUNW(data) {
  return {
      type: types.REQUEST_SEND_UNW_ACTION,
      data
  }
}

export function actSendUNWToken(data) {
  return {
      type: types.REQUEST_SEND_UNW_TOKEN,
      data
  }
}
