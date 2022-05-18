import {put, delay} from 'redux-saga/effects';
import {getPINKeychain} from '../../utils/keychainHelper';

import * as loginActions from '../actions/loginActions';

export function* autoLoginAsync(action) {
  const pin = yield getPINKeychain();
  if (pin) {
    yield put(loginActions.enableAutoLoader(true));
  } else {
    yield put(loginActions.enableAutoLoader(false));
  }
  yield delay(1000);
  yield put(loginActions.disableAutoLoader());
}
