import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import Modal from 'react-native-modal';
import {Icon} from 'native-base';
import QRCode from 'react-native-qrcode-svg';

import metrics from '../../config/metrics';
import {blackColor} from '../../utils/colorHelper';
import {AppButton} from '../AppButton';
import {helpers} from '../../utils/helpers';

export const WalletInfoModal = ({
  visible,
  unwAddress,
  setVisible = () => {},
}) => {
  return (
    <Modal
      isVisible={visible}
      onDismiss={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      useNativeDriver={true}
      style={{
        width: (13 * metrics.screenWidth) / 16,
        height: null,
        borderRadius: 24,
        overflow: 'hidden',
        alignSelf: 'center',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 15,
          }}>
          Your wallet address
        </Text>
        <View
          style={{
            alignSelf: 'center',
          }}>
          <QRCode
            value={unwAddress}
            size={120}
            color="black"
            backgroundColor="white"
          />
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.label}>
              {unwAddress}
            </Text>
          </View>
          <Pressable
            onPress={() => helpers.handleCopyToClipboard(unwAddress)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: blackColor(0.1),
            }}>
            <Icon
              type="MaterialCommunityIcons"
              name="content-copy"
              style={{fontSize: 18, color: 'black'}}
            />
          </Pressable>
        </View>
        <AppButton
          handleAction={() => setVisible(false)}
          disabled={false}
          minWidth={80}
          text="OK"
          style={{alignSelf: 'center', marginTop: 20}}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    color: blackColor(0.85),
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center'
  },
});
