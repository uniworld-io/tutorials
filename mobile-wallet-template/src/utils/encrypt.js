import CryptoJS from 'react-native-crypto-js';

export const encrypt = (text, encryptKey) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(text, encryptKey).toString();

    // encrypted = Buffer.concat([encrypted, cipher.final()]);
    // console.log('text encrypt: ' + ciphertext.toString('hex'));
    return ciphertext.toString();
    // return text
  } catch (error) {
    // console.log(error);
    return null;
  }
};

export const decrypt = (text, encryptKey) => {
  // console.log('-a-s-as-a-s', text, encryptKey);
  try {
    let bytes = CryptoJS.AES.decrypt(text, encryptKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    // console.log('text decrypt: ' + originalText.toString());

    return originalText.toString();
  } catch (error) {
    // console.log(error);
    return null;
  }
};
