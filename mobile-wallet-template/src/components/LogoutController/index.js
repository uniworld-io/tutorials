import React from 'react';
import { Pressable, Alert } from 'react-native';
import { Icon } from 'native-base';
import { useDispatch } from 'react-redux';

import * as userActions from '../../redux/actions/loginActions';
import { resetPINKeychain } from '../../utils/keychainHelper';

const LogoutController = (props) => {
  const dispatch = useDispatch();
  const confirmLogout = () => {
    Alert.alert(
      'Log out',
      'Do you really want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await resetPINKeychain();
            dispatch(userActions.logOut());
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <Pressable onPress={confirmLogout} style={{}}>
      <Icon
        type="Feather"
        name="power"
        style={{ fontSize: 28, color: '#CC393C' }}
      />
    </Pressable>
  );
};

export default LogoutController;
