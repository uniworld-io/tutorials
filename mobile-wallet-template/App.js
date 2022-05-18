/**
 * React Native App
 * Everything starts from the entrypoint
 */
import React from 'react';
import { ActivityIndicator, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import configureStore from './src/redux/store/configureStore';
import AppContainer from './src/AppContainer';

const { persistor, store } = configureStore();

const App = () => {
  LogBox.ignoreAllLogs(true);
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
};

export default App;
