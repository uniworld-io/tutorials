/**
 *  Redux saga class init
 */
import { all, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/types';
import { autoLoginAsync } from './loginSaga';
import { actSendNativeUnw, handleGetResourceAccount, handleTransferToken, handleSendUnwFutureAction, handleSubmitCreateToken } from './walletSaga';

export default function* watch() {
  yield all([takeLatest(types.AUTO_LOGIN_REQUEST, autoLoginAsync)]);
  yield all([takeLatest(types.REQUEST_SEND_UNW_ACTION, actSendNativeUnw)]);
  yield all([takeLatest(types.REQUEST_GET_ACCOUNT_RESOURCE, handleGetResourceAccount)]);
  yield all([takeLatest(types.REQUEST_SEND_UNW_TOKEN, handleTransferToken)]);
  yield all([takeLatest(types.REQUEST_SUBMIT_TRANSFER_TOKEN, handleTransferToken)]);
  yield all([takeLatest(types.REQUEST_SEND_FUTURE, handleSendUnwFutureAction)]);
  yield all([takeLatest(types.REQUEST_SUBMIT_ISSUE_TOKEN, handleSubmitCreateToken)]);
}
