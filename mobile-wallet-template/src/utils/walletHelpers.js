import CryptoJS from 'crypto-js';
import Unichain from '@uniworld/unichain-js';
// Import the ethers library
import { ethers, utils } from 'ethers';
import { en } from 'ethers/wordlists';

const UnichainWallet = Unichain.Wallet;

const generateMnemonic = async () => {
  try {
    const randomBytes = utils.randomBytes(32);
    const mnemonic = utils.HDNode.entropyToMnemonic(randomBytes, en);
    return mnemonic;
  } catch (e) {
    // console.log('------', e);
    return false;
  }
};

const generatePrivateKeyFromMnemonic = mnemonic => {
  try {
    const path = "m/44'/60'/0'/0/0";
    console.log('mnem', mnemonic);
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    return wallet.privateKey;
  } catch (error) {
    // console.log(error);
    return null;
  }
};


function generatePrivKeyWithUnichain(mnemonic) {
  try {
    const index = 0;
    const path = `m/44'/968'/${index}'/0/0`;
    const wallet = UnichainWallet.fromMnemonic(mnemonic, path);
    const privateKey = wallet.privateKey.replace(/^0x/, ''); //eth return 0x.. in private key
    const address = Unichain.address.fromPrivateKey(privateKey);
    // console.log('Wallet:', privateKey, ' ', address)
    return privateKey;
  } catch (error) {
    console.log(error);
  }

}

function genUnwAddressFromPrivateKey(privateKey) {
  return Unichain.address.fromPrivateKey(privateKey);
}

const keySize = 256;
const iterations = 100;

function encryptPrivateKey(msg, pass) {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
}

function decryptPrivateKey(transitmessage, pass) {
  const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  const encrypted = transitmessage.substring(64);

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

const unwAddressToHex = address => Unichain.address.toHex(address);

const hexToUnwAddress = address => Unichain.address.fromHex(address);

export const walletUtils = {
  decryptPrivateKey,
  encryptPrivateKey,
  generateMnemonic,
  genUnwAddressFromPrivateKey,
  generatePrivateKeyFromMnemonic,
  unwAddressToHex,
  hexToUnwAddress,
  generatePrivKeyWithUnichain
};
