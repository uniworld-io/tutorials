/**
 * Loading reducer made separate for easy blacklisting
 * Avoid data persist
 */
import createReducer from '../../lib/createReducer';
import * as types from '../actions/types';

const initialState = {
  isAppLoading: true,
  havingPIN: false,
  isLoginLoading: false,
  pinChecked: false,
  chance: 5,
  pwdLoading: false,
};

export const loadingReducer = createReducer(initialState, {
  [types.AUTO_LOGIN_ENABLE_LOADER](state, action) {
    return { ...state, isAppLoading: true, havingPIN: action.data };
  },
  [types.SET_PIN_SUCCESS](state, action) {
    return { ...state, havingPIN: true };
  },
  [types.SET_PIN_CHECKED](state, action) {
    return { ...state, pinChecked: action.data };
  },
  [types.AUTO_LOGIN_DISABLE_LOADER](state) {
    return { ...state, isAppLoading: false };
  },
  [types.LOGIN_ENABLE_LOADER](state) {
    return { ...state, isLoginLoading: true };
  },
  [types.LOGIN_DISABLE_LOADER](state) {
    return { ...state, isLoginLoading: false };
  },
  [types.PWD_MODAL_LOADING_ENABLE](state) {
    return { ...state, pwdLoading: true };
  },
  [types.PWD_MODAL_LOADING_DISABLE](state) {
    return { ...state, pwdLoading: false };
  },
  [types.UPDATE_CHANCE](state, action) {
    return { ...state, chance: action.data };
  },
  [types.LOG_OUT](state) {
    return { ...state, havingPIN: false, pinChecked: false, chance: 5, pwdLoading: false };
  },
});
