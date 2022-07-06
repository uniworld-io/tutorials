/* eslint-disable no-throw-literal */
import Unichain from '@uniworld/unichain-js';
import { NETWORK_CONFIG } from '../../config/customize';

const unichain = new Unichain({
  fullHost: NETWORK_CONFIG.BASE_URL,
  solidityNode: NETWORK_CONFIG.RELAY_NODE,
});

export const request = async (endpoint, method, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const resp = await unichain
      .currentProviders()
      .fullNode.request(endpoint, data, method);
    return resp;
  } catch (e) {
    console.log('unichain request', e);
    throw e;
  }
};

export const signedTx = async (unsignedData, privateKey) => {
  try {
    const resp = await unichain.unx.signTransaction(
      unsignedData,
      privateKey,
      0,
    );
    return resp;
  } catch (e) {
    console.log('unichain signed', e);
    throw {
      response: {
        data: {
          message: e,
        },
      },
    };
  }
};

export const sendRawTx = async signedData => {
  // eslint-disable-next-line no-useless-catch
  try {
    const resp = await unichain.unx.sendRawTransaction(signedData);
    return resp;
  } catch (e) {
    console.log('unichain tx', e);
    throw {
      response: {
        data: {
          message: e,
        },
      },
    };
  }
};
