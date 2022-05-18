import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Text,
  TextInput,
} from 'react-native';
import Slider from 'react-native-slider';
import {get, isEmpty} from 'lodash';

import {useDispatch, useSelector} from 'react-redux';
import {blackColor, COLORS} from '../../utils/colorHelper';
import {helpers} from '../../utils/helpers';
import {RegularText} from '../../components/CustomFontText/RegularText';
import metrics from '../../config/metrics';
import {Icon} from 'native-base';
import {SemiBoldText} from '../../components/CustomFontText/SemiBoldText';
import images from '../../config/images';
import {BoldText} from '../../components/CustomFontText/BoldText';
import {ThinText} from '../../components/CustomFontText/ThinText';
import {BrowserHeader} from './component/BrowserHeader';
import {CoinItem} from './component/CoinItem';
import {CoverScreen} from '../../components/CoverScreen';

const Browser = (props) => {
  const {navigation} = props;
  const unwAddress = useSelector((state) =>
    get(state, 'walletReducer.walletInfo.unwAddress', null),
  );

  const walletResource = useSelector((state) =>
    get(state, 'walletReducer.walletResource', null),
  );

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white, paddingBottom: 15}}>
      <SafeAreaView style={{flex: 1}}>
        <BrowserHeader />
        <View style={{flex: 1, padding: 15}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#2B2B2B',
            }}>
            <TextInput
              placeholder="Enter a URL"
              style={{flex: 1, color: COLORS.black, padding: 12, fontSize: 18}}
            />
            <Icon
              type="Feather"
              name="search"
              style={{color: '#B0B0B0', fontSize: 22, marginRight: 12}}
            />
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="history"
                  type="MaterialCommunityIcons"
                  style={{fontSize: 20, color: COLORS.black}}
                />
                <RegularText
                  style={{
                    textDecorationLine: 'underline',
                    fontSize: 16,
                    marginLeft: 6,
                  }}>
                  HISTORY
                </RegularText>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  name="history"
                  type="MaterialCommunityIcons"
                  style={{fontSize: 20, color: COLORS.black}}
                />
                <RegularText
                  style={{
                    textDecorationLine: 'underline',
                    fontSize: 16,
                    marginLeft: 6,
                  }}>
                  FAVORITES
                </RegularText>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <CoverScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: '#F5F5F6',
    borderRadius: 2,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Browser;
