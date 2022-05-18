import React from 'react';
import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { navigationRef } from './NavigationService';
import StartUp from '../screens/StartUp';
import { StatusBar, Pressable } from 'react-native';
import ImportWallet from '../screens/ImportWallet';
import CreateWallet from '../screens/CreateWallet';
import GenerateWalletInfo from '../screens/GenerateWalletInfo';
import WalletGreeting from '../screens/WalletGreeting';
import { Icon } from 'native-base';
import { blackColor, COLORS } from '../utils/colorHelper';
import TransactionHistory from '../screens/TransactionHistory';
import WalletScanner from '../screens/WalletScanner';
import { get } from 'lodash';
import Wallet from '../screens/Wallet';
import WalletCodeInfo from '../screens/WalletCodeInfo';
import SendCoin from '../screens/SendCoin';
import FutureHistory from '../screens/FutureHistory';

import FavoriteReceiver from '../screens/FavoriteReceiver';
import { CUSTOMIZE } from '../config/customize';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: 'bold', textAlign: 'center' },
        headerBackTitleVisible: false,
        headerLeft: props => {
          return (
            <Pressable style={{ paddingHorizontal: 5, width: 40 }} {...props}>
              <Icon
                name="chevron-back"
                style={{ fontSize: 34, color: blackColor(1) }}
              />
            </Pressable>
          );
        },
        headerRight: () => <View style={{ width: 40 }} />,
        headerStyle: {
          borderBottomWidth: 0,
          elevation: 0,
          shadowRadius: 0,
          shadowOffset: {
            height: 0,
          },
        },
      }}>
      <Stack.Screen
        name="ImportWallet"
        component={ImportWallet}
        options={{
          title: 'Uniworld Wallet',
          headerLeft: () => <View style={{ width: 40 }} />
        }}
      />
      <Stack.Screen
        name="CreateWallet"
        component={CreateWallet}
        options={{
          title: 'Secure Password',
        }}
      />
      <Stack.Screen
        name="WalletGreeting"
        component={WalletGreeting}
        options={{
          title: 'Create New Wallet',
        }}
      />
      <Stack.Screen
        name="GenerateWalletInfo"
        component={GenerateWalletInfo}
        options={{
          title: 'Wallet Information',
        }}
      />
    </AuthStack.Navigator>
  );
};

const RootNavigation = props => {
  const { theme } = props;
  const isLoggedIn = useSelector(state =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );
  const havingPIN = useSelector(state =>
    get(state, 'loadingReducer.havingPIN', false),
  );
  const pinChecked = useSelector(state =>
    get(state, 'loadingReducer.pinChecked', false),
  );
  const isAppLoading = useSelector(state =>
    get(state, 'loadingReducer.isAppLoading', false),
  );

  if (isAppLoading) {
    return <StartUp />;
  }

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.dark ? 'black' : 'white'}
      />

      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Wallet"
              component={Wallet}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="WalletCodeInfo"
              component={WalletCodeInfo}
              options={({ route, navigation, ...props }) => ({
                headerTitle: 'Receive',
                headerTitleStyle: {
                  fontSize: 28,
                  color: CUSTOMIZE.primary_color,
                  textAlign: 'left',
                },
                headerTitleAlign: 'left',
                headerLeft: null,
                headerStyle: {
                  borderBottomWidth: 0,
                  elevation: 0,
                  shadowRadius: 0,
                  shadowOffset: {
                    height: 0,
                  },
                },
                headerRight: props => (
                  <Pressable onPress={() => navigation.goBack()} {...props}>
                    <Icon
                      name="keyboard-backspace"
                      type="MaterialCommunityIcons"
                      style={{
                        fontSize: 36,
                        color: CUSTOMIZE.primary_color,
                        paddingRight: 15,
                      }}
                    />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="SendCoin"
              component={SendCoin}
              options={({ route, navigation, ...props }) => ({
                gestureEnabled: false,
                headerTitle: 'Send',
                headerTitleStyle: {
                  fontSize: 28,
                  color: CUSTOMIZE.primary_color,
                  textAlign: 'left',
                },
                headerTitleAlign: 'left',
                headerLeft: null,
                headerStyle: {
                  borderBottomWidth: 0,
                  elevation: 0,
                  shadowRadius: 0,
                  shadowOffset: {
                    height: 0,
                  },
                },
                headerRight: props => (
                  <Pressable onPress={() => navigation.goBack()} {...props}>
                    <Icon
                      name="keyboard-backspace"
                      type="MaterialCommunityIcons"
                      style={{
                        fontSize: 36,
                        color: CUSTOMIZE.primary_color,
                        paddingRight: 15,
                      }}
                    />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="FavoriteReceiver"
              component={FavoriteReceiver}
              options={({ route, navigation, ...props }) => ({
                gestureEnabled: false,
                headerTitle: 'Favorite Receiver',
                headerTitleStyle: {
                  fontSize: 28,
                  color: CUSTOMIZE.primary_color,
                  textAlign: 'left',
                },
                headerTitleAlign: 'left',
                headerLeft: null,
                headerStyle: {
                  borderBottomWidth: 0,
                  elevation: 0,
                  shadowRadius: 0,
                  shadowOffset: {
                    height: 0,
                  },
                },
                headerRight: (props) => (
                  <Pressable onPress={() => navigation.goBack()} {...props}>
                    <Icon
                      name="keyboard-backspace"
                      type="MaterialCommunityIcons"
                      style={{
                        fontSize: 36,
                        color: CUSTOMIZE.primary_color,
                        paddingRight: 15,
                      }}
                    />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="TransactionHistory"
              component={TransactionHistory}
              options={{
                title: 'Transactions',
              }}
            />
            <Stack.Screen
              name="FutureHistory"
              component={FutureHistory}
              options={({ route, navigation, ...props }) => ({
                gestureEnabled: false,
                headerTitle: 'Future Deal',
                headerTitleStyle: {
                  fontSize: 28,
                  color: CUSTOMIZE.primary_color,
                  textAlign: 'left',
                },
                headerTitleAlign: 'left',
                headerLeft: null,
                headerStyle: {
                  borderBottomWidth: 0,
                  elevation: 0,
                  shadowRadius: 0,
                  shadowOffset: {
                    height: 0,
                  },
                },
                headerRight: props => (
                  <Pressable onPress={() => navigation.goBack()} {...props}>
                    <Icon
                      name="keyboard-backspace"
                      type="MaterialCommunityIcons"
                      style={{
                        fontSize: 36,
                        color: CUSTOMIZE.primary_color,
                        paddingRight: 15,
                      }}
                    />
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="WalletScanner"
              component={WalletScanner}
              options={({ route, navigation, ...props }) => ({
                ...TransitionPresets.SlideFromRightIOS,
                headerTitle: 'Scan',
                headerTitleStyle: {
                  fontSize: 28,
                  color: CUSTOMIZE.primary_color,
                  textAlign: 'left',
                },
                headerTitleAlign: 'left',
                headerLeft: null,
                headerStyle: {
                  borderBottomWidth: 0,
                  elevation: 0,
                  shadowRadius: 0,
                  shadowOffset: {
                    height: 0,
                  },
                },
                // headerLeft: null,
                headerRight: props => (
                  <Pressable onPress={() => navigation.goBack()} {...props}>
                    <Icon
                      name="keyboard-backspace"
                      type="MaterialCommunityIcons"
                      style={{
                        fontSize: 36,
                        color: CUSTOMIZE.primary_color,
                        paddingRight: 15,
                      }}
                    />
                  </Pressable>
                ),
              })}
            />
          </>
        ) : (
          <Stack.Screen
            name="AuthStack"
            component={AuthNavigator}
            options={{
              headerShown: false,
            }}
          // options={{
          //   headerRight: () => <ThemeController />,
          // }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
