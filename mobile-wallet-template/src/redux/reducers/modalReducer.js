/**
 * Loading reducer made separate for easy blacklisting
 * Avoid data persist
 */
import createReducer from '../../lib/createReducer';
import * as types from '../actions/types';

const initialState = {
    txVisible: false,
    txHash: '',
    txError: ''
};

export const modalReducer = createReducer(initialState, {
    [types.TX_STATUS_MODAL_SHOW](state, action) {
        return { ...state, txVisible: true, txHash: action.data };
    },
    [types.TX_STATUS_MODAL_SHOW_ERROR](state, action) {
        return { ...state, txVisible: true, txHash: '', txError: action.data };
    },
    [types.TX_STATUS_MODAL_DISMISS](state, action) {
        return initialState;
    },
    [types.LOG_OUT](state) {
        return initialState;
    },
});
