import * as Keychain from 'react-native-keychain';

export const savePINKeyChain = async (pin) => {
  await Keychain.setGenericPassword(pin, pin);
};

export const getPINKeychain = async () => {
  try {
    // Retrieve the credentials
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log('Credentials successfully loaded for user ' + credentials);
      return credentials.username;
    } else {
      console.log('No credentials stored');
      return null;
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
    return null;
  }
};

export const resetPINKeychain = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};
