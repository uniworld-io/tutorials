
import { apiClient } from './client';
import ApiConfig from '../../config/api-config';

export default function validateLogin(encrypt_private_key, unwAddress, ip) {
  return apiClient.post(`https://accounts.uniworld.io/api${ApiConfig.VALIDATE_LOGIN}`, {
    fingerprint: encrypt_private_key,
    ip,
    email: `${unwAddress}@gmail.com`,
  });
}
