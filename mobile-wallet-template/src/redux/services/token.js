import ApiConfig from '../../config/api-config';
import {apiClient} from './client';

export const getListTokens = (data) => {
  return apiClient.post(ApiConfig.GET_ALL_TOKEN_POOL, data);
};

export const getTokenDetail = (data) => {
  return apiClient.post(ApiConfig.GET_TOKEN_DETAIL, data);
};

export const createAssetToken = (data) => {
  return apiClient.post(
    '/wallet/createassetissue',
    data,
    ApiConfig.BASE_URL,
  );
};

export const purchaseToken = (data) => {
  return apiClient.post(
    '/wallet/participateassetissue',
    data,
    ApiConfig.BASE_URL,
  );
};
