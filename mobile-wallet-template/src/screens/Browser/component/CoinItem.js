import React, {useState} from 'react';
import {Pressable, View, Image} from 'react-native';
import images from '../../../config/images';
import {ThinText} from '../../../components/CustomFontText/ThinText';
import {BoldText} from '../../../components/CustomFontText/BoldText';
import {helpers} from '../../../utils/helpers';
import {Icon} from 'native-base';
import {get} from 'lodash';
import { CONSTANTS, CUSTOMIZE } from '../../../config/customize';

export const CoinItem = ({
  walletResource,
  showBalance = true,
  coin = CUSTOMIZE.token_name,
  logo = images.banner,
}) => {
  return (
    <Pressable
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: '#F5F5F6',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
      }}>
      <Image source={logo} style={{width: 40, height: 40, borderRadius: 6}} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginLeft: 5,
        }}>
        <BoldText style={{fontSize: 20}}>{coin}</BoldText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {showBalance && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ThinText style={{fontSize: 11, color: '#A4A4A4'}}>
                AVAILABLE
              </ThinText>
              <BoldText style={{marginLeft: 8, fontSize: 20}}>
                {helpers.formatNumber(get(walletResource, 'balance', 0))}
              </BoldText>
            </View>
          )}
          <Icon
            name="chevron-thin-down"
            type="Entypo"
            style={{fontSize: 18, color: '#7A7A7A', marginLeft: 8}}
          />
        </View>
      </View>
    </Pressable>
  );
};
