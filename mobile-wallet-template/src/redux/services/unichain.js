/* eslint-disable no-throw-literal */
import Unichain from '@uniworld/unichain-js';

export const UNICHAIN_NETWORK = 'https://test-seed.unichain.world';
export const RELAY_NETWORK = 'https://test-seed-relay.unichain.world';

const unichain = new Unichain({
  fullHost: UNICHAIN_NETWORK,
  solidityNode: RELAY_NETWORK,
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
