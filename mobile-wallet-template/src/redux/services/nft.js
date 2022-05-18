import ApiConfig from '../../config/api-config';
import {apiClient} from './client';
import {NFT_TOKEN_TYPE} from '../../config/variable';
import {MESSAGES} from '../../config/constants';
import {signedTx, sendRawTx} from './unichain';

export const create = async (data, privateKey) => {
  try {
    const unsignedData = await apiClient.post(
      ApiConfig.CREATE_NFT_TEMPLATE,
      data,
    );
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    throw {
      message: e?.response?.data?.message || MESSAGES.CREATE_NFT_FAILED,
    };
  }
};

export const mint = async (data, privateKey) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const unsignedData = await apiClient.post(ApiConfig.MINT_NFT_TOKEN, data);
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    console.log(e);
    throw {
      message: e?.response?.data?.message || MESSAGES.MINT_NFT_FAILED,
    };
  }
};

export const find = async (address, owner, page, limit) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const resp = await apiClient.get(ApiConfig.FETCH_NFT_TEMPLATES, {
      params: {
        owner_address: address,
        page_index: page,
        page_size: limit,
        owner_type: owner,
      },
    });
    return resp;
  } catch (e) {
    console.log(e);
    throw {
      message: e?.response?.data?.message || MESSAGES.GET_NFT_TEMPLATE_FAILED,
    };
  }
};

export const findToken = async (address, owner, page, limit) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const resp = await apiClient.get(
      owner === NFT_TOKEN_TYPE.OWNER
        ? ApiConfig.FETCH_NFT_TOKENS
        : ApiConfig.FETCH_NFT_APPROVE_TOKENS,
      {
        params: {
          owner_address: address,
          page_index: page,
          page_size: limit,
        },
      },
    );
    return resp;
  } catch (e) {
    throw {
      message: e?.response?.data?.message || MESSAGES.GET_NFT_TOKEN_FAILED,
    };
  }
};

export const transfer = async (data, privateKey) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const unsignedData = await apiClient.post(
      ApiConfig.TRANSFER_NFT_TOKENS,
      data,
    );
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    throw {
      message: e?.response?.data?.message || MESSAGES.TRANSFER_NFT_TOKEN_FAILED,
    };
  }
};

export const renounce = async (data, privateKey) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const unsignedData = await apiClient.post(
      ApiConfig.RENOUNCE_NFT_MINTER,
      data,
    );
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    throw {
      message:
        e?.response?.data?.message || MESSAGES.RENOUNCE_NFT_MINTER_FAILED,
    };
  }
};

export const replaceMinter = async (data, privateKey) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const unsignedData = await apiClient.post(
      ApiConfig.REPLACE_NFT_MINTER,
      data,
    );
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    throw {
      message: e?.response?.data?.message || MESSAGES.REPLACE_NFT_MINTER_FAILED,
    };
  }
};

export const burnToken = async (data, privateKey) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const unsignedData = await apiClient.post(ApiConfig.BURN_NFT_TOKEN, data);
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    throw {
      message: e?.response?.data?.message || MESSAGES.BURN_NFT_TOKEN_FAILED,
    };
  }
};

export const approveToken = async (data, privateKey) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const unsignedData = await apiClient.post(
      ApiConfig.APPROVE_NFT_TOKENS,
      data,
    );
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    throw {
      message: e?.response?.data?.message || MESSAGES.APPROVE_NFT_TOKEN_FAILED,
    };
  }
};

export const approveAllToken = async (data, privateKey) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const unsignedData = await apiClient.post(
      ApiConfig.APPROVE_ALL_NFT_TOKENS,
      data,
    );
    const signedData = await signedTx(unsignedData, privateKey);
    const txData = await sendRawTx(signedData);
    return txData;
  } catch (e) {
    throw {
      message: e?.response?.data?.message || MESSAGES.APPROVE_NFT_TOKEN_FAILED,
    };
  }
};

export const getApproveAllToken = async address => {
  // eslint-disable-next-line no-useless-catch
  try {
    const resp = await apiClient.get(ApiConfig.GET_APPROVE_ALL_TOKEN, {
      params: {
        owner_address: address,
      },
    });
    return resp;
  } catch (e) {
    throw {
      message:
        e?.response?.data?.message || MESSAGES.GET_APPROVE_ALL_NFT_TOKEN_FAILED,
    };
  }
};
