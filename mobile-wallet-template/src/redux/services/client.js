import axios from 'axios';

import ApiConfig from '../../config/api-config';

const request = axios.create({
  baseURL: ApiConfig.BASE_URL,
  timeout: 15000,
});

const apiClient = {
  get: (url, data) => {
    return request
      .get(url, data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  },
  post: (url, data) => {
    return request({
      method: 'post',
      url: url,
      data: data,
    })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  },
  delete: (url, data) => {
    return request({
      method: 'delete',
      url: url,
      data: data,
    })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  },
  put: (url, data) => {
    return request({
      method: 'put',
      url: url,
      data: data,
    })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  },
};

export {apiClient};
