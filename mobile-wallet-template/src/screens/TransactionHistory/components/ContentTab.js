import React from 'react';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppButton} from '../../../components/AppButton';

import {blackColor} from '../../../utils/colorHelper';
import {helpers} from '../../../utils/helpers';
import {TransactionItem} from '../../Home/components/TransactionItem';

const ContentTab = ({keyExtract, ...props}) => {
  const dispatch = useDispatch();

  return (
    <View style={{flex: 1, padding: 15}}>
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
          renderItem={({item, index}) => {
            return <TransactionItem index={index} positive={index % 2} />;
          }}
          keyExtractor={(item, index) =>
            index + keyExtract + 'transaction_item'
          }
          ListFooterComponent={FooterSeeMore}
        />
      </SafeAreaView>
    </View>
  );
};

const FooterSeeMore = () => {
  return (
    <AppButton
      handleAction={helpers._handleLink('')}
      text="SEE MORE"
      style={styles.btn}
    />
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
  btn: {
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default ContentTab;
