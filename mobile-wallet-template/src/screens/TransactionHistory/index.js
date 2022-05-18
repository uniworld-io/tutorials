import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {Icon, Tab, Tabs, ScrollableTab, TabHeading} from 'native-base';

import {blackColor} from '../../utils/colorHelper';
import ContentTab from './components/ContentTab';

const TransactionHistory = (props) => {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState(0);

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Tabs
          onChangeTab={(e) => setCurrentTab(e.i)}
          page={currentTab}
          tabContainerStyle={{
            height: 44,
            borderTopWidth: 0,
            borderTopColor: 'white',
            elevation: 0,
            // borderBottomWidth: 0,
          }}
          tabBarUnderlineStyle={{height: 2, backgroundColor: 'black'}}
          tabBarActiveTextColor={'black'}
          tabBarBackgroundColor={'white'}>
          {['All', 'Received', 'Sent'].map((item, index) => (
            <Tab
              textStyle={styles.textStyle}
              activeTextStyle={styles.activeTextStyle}
              activeTabStyle={styles.activeTabStyle}
              tabStyle={styles.tabStyle}
              heading={
                <TabHeading style={{backgroundColor: 'white'}}>
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      color: currentTab == index ? 'black' : blackColor(0.55),
                    }}>
                    {item}
                  </Text>
                </TabHeading>
              }>
              <ContentTab keyExtract={item} />
            </Tab>
          ))}
        </Tabs>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainerStyle: {
    backgroundColor: '#fff',
  },
  activeTabStyle: {
    backgroundColor: '#fff',
  },
  tabStyle: {
    backgroundColor: '#fff',
  },
  textStyle: {
    fontSize: 14,
  },
  activeTextStyle: {
    fontSize: 14,
    paddingVertical: 3,
    color: blackColor(1),
    textTransform: 'none',
  },
});

export default TransactionHistory;
