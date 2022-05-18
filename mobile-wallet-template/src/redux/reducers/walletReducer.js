import createReducer from '../../lib/createReducer';
import * as types from '../actions/types';

const initialState = {
  walletInfo: null,
  walletResource: null,
  usdtPair: 0,
};

export const walletReducer = createReducer(initialState, {
  [types.FETCH_WALLET_INFO_SUCCESS](state, action) {
    return {...state, walletInfo: action.data};
  },
  [types.ENCRYPTED_PRIVATE_KEY](state, action) {
    return {
      ...state,
      walletInfo: {...state.walletInfo, encryptedPrivateKey: action.data},
    };
  },
  [types.GET_ACCOUNT_RESOURCE_SUCCESS](state, action) {
    return {
      ...state,
      walletResource: action.data,
    };
  },
  [types.UNLOCK_UNW_SUCCESS](state, action) {
    return {
      ...state,
      walletResource: {
        ...state.walletResource,
        lock: 0,
        balance: state.walletResource.balance + action.data,
      },
    };
  },
  [types.LOCK_UNW_SUCCESS](state, action) {
    return {
      ...state,
      walletResource: {
        ...state.walletResource,
        lock: state.walletResource.lock + action.data * 1000000,
        balance: state.walletResource.balance - action.data * 1000000,
      },
    };
  },
  [types.LOCK_ENERGY_UNW_SUCCESS](state, action) {
    return {
      ...state,
      walletResource: {
        ...state.walletResource,
        energy_lock: {
          balance:
            state.walletResource.energy_lock.balance + action.data * 1000000,
        },
        balance: state.walletResource.balance - action.data * 1000000,
      },
    };
  },
  [types.HANDLE_EDIT_BALANCE](state, action) {
    return {
      ...state,
      walletResource: {
        ...state.walletResource,
        balance: state.walletResource.balance - action.data,
      },
    };
  },
  [types.GET_REWARD_SUCCESS](state, action) {
    return {
      ...state,
      walletResource: {
        ...state.walletResource,
        balance: state.walletResource.balance + action.data,
        reward: 0
      },
    };
  },
  [types.UPDATE_USDT_PAIR](state, action) {
    return {
      ...state,
      usdtPair: action.data,
    };
  },
  [types.GET_WALLET_REWARD](state, action) {
    return {
      ...state,
      walletResource: {
        ...state.walletResource,
        // balance: state.walletResource.balance + action.data,
        reward: action.data,
      },
    };
  },
  [types.UPDATE_VOTE_COUNT](state, action) {
    return {
      ...state,
      walletResource: {
        ...state.walletResource,
        vote_count: action.data,
      },
    };
  },
  [types.LOG_OUT](state, action) {
    return initialState;
  },
});
