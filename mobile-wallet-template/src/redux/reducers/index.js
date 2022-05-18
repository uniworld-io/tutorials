/*
 * combines all the existing reducers
 */
import * as loadingReducer from './loadingReducer';
import * as themeReducer from './themeReducer';
import * as walletReducer from './walletReducer';
import * as modalReducer from './modalReducer';
export default Object.assign(
  loadingReducer,
  themeReducer,
  walletReducer,
  modalReducer
);
