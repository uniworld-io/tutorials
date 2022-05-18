import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  PERMISSIONS,
  check,
  request,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
import RNQRGenerator from 'rn-qr-generator';
import { launchImageLibrary } from 'react-native-image-picker';
import BarcodeMask from 'react-native-barcode-mask';
import { useIsFocused } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import metrics from '../../config/metrics';
import { helpers } from '../../utils/helpers';
import { AppButton } from '../../components/AppButton';
import { Icon } from 'native-base';
import { RegularText } from '../../components/CustomFontText/RegularText';
import { COLORS } from '../../utils/colorHelper';
import { SemiBoldText } from '../../components/CustomFontText/SemiBoldText';

const options = {
  title: 'photoUpload',
  takePhotoButtonTitle: 'photoTake',
  chooseFromLibraryButtonTitle: 'photoLibrary',
  cancelButtonTitle: 'cancel',
  quality: 0.7,
  base64: true,
  maxWidth: 728,
};

const WalletScanner = (props) => {
  const { colors } = useTheme();
  const refScanner = useRef();
  const isFocused = useIsFocused();
  const { navigation, route } = props;

  const dispatch = useDispatch();

  const [cameraGranted, setCameraGranted] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [active, setActive] = useState(false);
  const [detectedCode, setDetectedCode] = useState([]);

  const handleCameraPermission = async () => {
    if (helpers.isIOS) {
      const res = await check(PERMISSIONS.IOS.CAMERA);
      if (res === RESULTS.GRANTED) {
        setCameraGranted(true);
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        res2 === RESULTS.GRANTED
          ? setCameraGranted(true)
          : setCameraGranted(false);
      }
    } else {
      const res = await check(PERMISSIONS.ANDROID.CAMERA);
      if (res === RESULTS.GRANTED) {
        setCameraGranted(true);
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.ANDROID.CAMERA);
        res2 === RESULTS.GRANTED
          ? setCameraGranted(true)
          : setCameraGranted(false);
      }
    }
  };

  useEffect(() => {
    if (detectedCode.length > 0) {
      route.params.setValue(detectedCode[0]);
      navigation.goBack();
    }
  }, [detectedCode]);

  const onPhotoPick = () => {
    launchImageLibrary(options, (response) => {
      RNQRGenerator.detect({ uri: response.uri })
        .then((res) => {
          // setDetectedCode(['res.values']);
          // console.log('ajkhskjahjsa', res.values);
          setDetectedCode(res.values);
        })
        .catch((err) => {
          console.log('Cannot detect', err);
        });
    });
  };

  useEffect(() => {
    handleCameraPermission();
    return () => {
    };
  }, []);

  const onSuccess = (e) => {
    console.log('result === ', e.data);
    if (e.data) {
      route.params.setValue(e.data);
      navigation.goBack();
    }
  };

  if (!cameraGranted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', lineHeight: 26, fontSize: 15 }}>
          {
            'We need "Camera" permission for this action.\nPlease accept this permission for us'
          }
        </Text>
        <AppButton
          handleAction={() => openSettings()}
          disabled={false}
          text="Go to Settings"
          style={{ alignSelf: 'center', marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isFocused && (
        <RNCamera
          style={{ flex: 1 }}
          onBarCodeRead={onSuccess}
          ref={refScanner}
          flashMode={
            showFlash ?
              RNCamera.Constants.FlashMode.torch :
              RNCamera.Constants.FlashMode.off
          }
        >
          <BarcodeMask width={(3 * metrics.screenWidth) / 4} height={(3 * metrics.screenWidth) / 4} />
        </RNCamera>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 30, right: 30
        }}>
        <Pressable onPress={() => setShowFlash(!showFlash)} >
          <Icon name="lightbulb" type="Foundation" style={{ color: showFlash ? 'yellow' : 'red' }} />
        </Pressable>
      </View>
      <View style={{ position: 'absolute', top: metrics.screenHeight / 2 + 140, alignSelf: 'center' }}>
        <RegularText style={{ color: COLORS.white, textAlign: 'center', fontSize: 15 }}>Scan the QRCode to identify the target user</RegularText>
      </View>
      <Pressable
        onPress={onPhotoPick}
        style={{ position: 'absolute', bottom: 60, alignSelf: 'center', paddingVertical: 12, justifyContent: 'center', backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2' }}
      >
        <Icon
          name="upload"
          type="Feather"
          style={{ fontSize: 22, color: COLORS.black, marginRight: 10, }}
        />
        <SemiBoldText style={{ color: COLORS.black, fontSize: 16 }}>Scan from photo</SemiBoldText>
      </Pressable>
    </View >
  );
};

export default WalletScanner;
