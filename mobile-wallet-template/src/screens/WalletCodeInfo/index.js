import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { get, isEmpty } from 'lodash';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

import { useDispatch, useSelector } from 'react-redux';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { helpers } from '../../utils/helpers';
import { RegularText } from '../../components/CustomFontText/RegularText';
import metrics from '../../config/metrics';
import { Icon } from 'native-base';
import { CONSTANTS, CUSTOMIZE } from '../../config/customize';

const WalletCodeInfo = (props) => {
  const { navigation } = props;
  const unwAddress = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );

  const walletResource = useSelector((state) =>
    get(state, 'walletReducer.walletResource', null),
  );

  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 15 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20 }}
          style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: 'center',
              marginVertical: 20,
            }}>
            <QRCode
              value={unwAddress}
              size={helpers.isTablet ? 320 : (metrics.screenWidth * 2) / 3}
              color="black"
              backgroundColor="white"
            />
          </View>
          <RegularText
            style={{
              textAlign: 'center',
              color: '#7F7F7F',
              marginVertical: 10,
              fontSize: 15,
            }}
            numberOfLines={1}
            ellipsizeMode="middle">
            {unwAddress}
          </RegularText>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <Pressable
              onPress={() => helpers.handleCopyToClipboard(unwAddress)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                backgroundColor: CUSTOMIZE.primary_color,
                borderRadius: 8,
                flex: 1,
                marginRight: 20,
                justifyContent: 'center',
              }}>
              <Icon
                name="copy1"
                type="AntDesign"
                style={{ fontSize: 22, color: COLORS.white }}
              />
              <RegularText
                style={{ marginLeft: 8, color: COLORS.white, fontSize: 20 }}>
                Copy
              </RegularText>
            </Pressable>
            <Pressable
              onPress={() => {
                Share.open({
                  title: 'My Uni Wallet address',
                  subject: `Let share your ${CUSTOMIZE.token_name} with me`,
                  message: unwAddress,
                })
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    err && console.log(err);
                  });
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                backgroundColor: COLORS.black,
                borderRadius: 8,
                flex: 1,
                justifyContent: 'center',
              }}>
              <Icon
                name="sharealt"
                type="AntDesign"
                style={{ fontSize: 22, color: COLORS.white }}
              />
              <RegularText
                style={{ marginLeft: 8, color: COLORS.white, fontSize: 20 }}>
                Share
              </RegularText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  transaction: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: blackColor(0.7),
  },
  floatingBtn: {
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: helpers.isIpX ? helpers.bottomSpace : 15,
    right: 15,
  },
});

export default WalletCodeInfo;
