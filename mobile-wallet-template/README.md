# Unichain Wallet Template
## Features

This mobile application is updated with:

- [React 17](https://reactjs.org)
- [React Native 0.66.0 and upper](https://reactnative.dev)
- [Native Base v2](https://nativebase.io/)
- [React Navigation v5](https://reactnavigation.org/docs/5.x/getting-started)

## Installing and Running

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **14**.
2. Setup [development environment](https://reactnative.dev/docs/environment-setup)
3. Clone this repository.
4. Run `npm install` or `yarn` to install the dependencies.
5. With iOS, run `cd ios && pod install` to install podfile
6. Run `yarn ios` or `yarn android`
7. Happy hacking.


## Customization

### Change package name (Android) and bundle ID (iOS)

Use [React-native-rename](https://www.npmjs.com/package/react-native-rename) to change your package name
Note: With iOS, you still open your project with XCode and change bundle ID manually

### Customization in app

All you can find in customize.js file in source code (logo, primary color, currency, rpc configuration...)


## Packing

To build application for releasing (production mode)

### Android

1. Follow this [instruction](https://reactnative.dev/docs/signed-apk-android) first
```
1. $ cd android
2. $ ./gradlew assembleRelease (.apk file ) or ./gradlew bundleRelease (.aab file)
```
Bring .aab or .apk file above and submit to [Google Console](https://play.google.com/console/about/)
### iOS
```
1. Prepare an paid Apple Account
2. Assemble App Store Information
3. Create a Bundle Identifier
4. Create a Certificate Signing Request
5. Create an App Store Production Certificate
6. Create a Production Provisioning Profile
7. Create an App Store Listing
8. Create a Release Build
9. Fill in the Version Information
10. Submit Version for Review
11. Release
```
Please follow [this guide](https://clearbridgemobile.com/how-to-submit-an-app-to-the-app-store/) for more information 

@ Uniworld R&D Team
