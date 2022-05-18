/* eslint-disable no-throw-literal */
import ApiConfig from '../../config/api-config';
import {apiClient} from './client';
import {MESSAGES} from '../../config/constants';
import Axios from 'axios';
import {Buffer} from 'buffer';

export const uploadToS3 = async (fileDir, filename, file) => {
  try {
    // Get signed url
    const signedUrlResp = await apiClient.get(
      `${ApiConfig.BASE_EXPLORER_URL}${ApiConfig.GET_S3_SIGNED_URL}`,
      {
        params: {
          fileDir,
          fileName: filename,
        },
      },
    );
    const signedUrl = signedUrlResp.data;

    // Upload request
    const buffer = Buffer.from(file, 'base64');
    const urlS3Resp = await Axios.put(signedUrl, buffer);

    return urlS3Resp.config?.url?.split('?')[0];
  } catch (e) {
    console.log(e);
    throw {
      message: e?.response?.data?.message || MESSAGES.UPLOAD_S3_FAILED,
    };
  }
};
