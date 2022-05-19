import React from 'react';
import { get } from 'lodash';
import {
  Pressable,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { BoldText } from '../../../components/CustomFontText/BoldText';
import { RegularText } from '../../../components/CustomFontText/RegularText';
import images from '../../../config/images';
import { blackColor, COLORS } from '../../../utils/colorHelper';
import { helpers } from '../../../utils/helpers';
import { CONTRACT_TYPE_MAPPING } from '../../../config/constants';
import { CUSTOMIZE } from '../../../config/customize';

export const TransactionItem = ({ owner = '', item, setTxVisible = () => { } }) => {

  return (
    <Pressable
      onPress={() =>
        setTxVisible(item)
      }
      style={styles.content}>
      <Image
        source={
          get(item, 'to_address', '') ?
            get(item, 'from_address', '') === owner
              ? images.send1
              : images.receive1
            :
            images.trx
        }
        style={{ width: 36, height: 36, resizeMode: 'contain' }}
      />
      <View
        style={{ flex: 1, marginRight: 25, paddingVertical: 14, marginLeft: 5 }}>
        <RegularText
          numberOfLines={1}
          ellipsizeMode='middle'
          style={{
            color: COLORS.black,
          }}>
          {get(item, 'from_address', '') === owner ? 'To: ' : 'From: '}
          {get(item, 'from_address', '') === owner ? get(item, 'to_address', `URC-30 ${String(get(item, 'token', '')).toUpperCase()} Pool`) : get(item, 'from_address', '')}
        </RegularText>
        <RegularText
          numberOfLines={1}
          style={{
            marginTop: 7,
            color: COLORS.black,
            fontWeight: '600'
          }}>
          {CONTRACT_TYPE_MAPPING[get(item, 'type', '')]}
        </RegularText>
      </View>
      <View style={{ justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <BoldText
            style={{
              fontSize: 14,
              textAlign: 'right',
              color:
                item?.to_address ?
                  get(item, 'from_address', '') === owner
                    ? item?.from_address === item?.to_address ? '#4EA550' : '#EA3424'
                    : '#4EA550'
                  :
                  COLORS.black
            }}>
            {
              item?.to_address ?
                get(item, 'from_address', '') === owner
                  ? item?.from_address === item?.to_address ? '+' : '-'
                  : '+'
                :
                ''
            }
            {item?.token === 'UNW' ?
              helpers.formatCurrency(helpers.formatNumber(get(item, 'amount', 0)))
              :
              helpers.formatCurrency(get(item, 'amount', 0))
            }
          </BoldText>
          <BoldText
            style={{
              fontSize: 14,
              color: 'black',
            }}>
            {" "}{
              get(item, 'token', '') ?
                get(item, 'token', '')
                :
                get(item, 'token', CUSTOMIZE.token_name)}
          </BoldText>
        </View>
        <RegularText
          numberOfLines={1}
          ellipsizeMode='middle'
          style={{
            ...styles.txText,
            color: '#636363'
          }}>
          {helpers.getDateFromEpochTime(get(item, 'time', ''))}
        </RegularText>
      </View>
    </Pressable >
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    paddingHorizontal: 10,
    borderBottomColor: blackColor(0.08),
    borderBottomWidth: 1,
  },
  txText: {
    marginTop: 7,
    textAlign: 'right',
    maxWidth: 210,
    alignSelf: 'flex-end',
    fontSize: 12
  }
});
