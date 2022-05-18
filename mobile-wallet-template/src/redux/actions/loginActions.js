/*
 * Reducer actions related with login
 */
import * as types from './types';

export function requestAutoLogin() {
  return {
    type: types.AUTO_LOGIN_REQUEST,
  };
}

export function requestLogin(username, password) {
  return {
    type: types.LOGIN_REQUEST,
    username,
    password,
  };
}

export function loginFailed() {
  return {
    type: types.LOGIN_FAILED,
  };
}

export function onLoginResponse(response) {
  return {
    type: types.LOGIN_RESPONSE,
    response,
  };
}

export function enableLoader() {
  return {
    type: types.LOGIN_ENABLE_LOADER,
  };
}

export function disableLoader() {
  return {
    type: types.LOGIN_DISABLE_LOADER,
  };
}

export function enableAutoLoader(data) {
  return {
    type: types.AUTO_LOGIN_ENABLE_LOADER,
    data,
  };
}

export function setPINSuccess() {
  return {
    type: types.SET_PIN_SUCCESS,
  };
}

export function setPinChecked(data) {
  return {
    type: types.SET_PIN_CHECKED,
    data,
  };
}

export function disableAutoLoader() {
  return {
    type: types.AUTO_LOGIN_DISABLE_LOADER,
  };
}

export function editChance(data) {
  return {
    type: types.UPDATE_CHANCE,
    data,
  };
}

export function logOut() {
  return {
    type: types.LOG_OUT,
  };
}
