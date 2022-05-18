import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    SafeAreaView,
    Pressable,
    StyleSheet,
    TextInput,
} from 'react-native';
import { filter, find, get } from 'lodash';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

import { useDispatch, useSelector } from 'react-redux';
import { blackColor, COLORS } from '../../utils/colorHelper';
import { LOCAL_KEYS, MESSAGES } from '../../config/constants';
import { getLocalJson, saveItemLocal } from '../../utils/localStorage';
import { AccountItem } from './com/AccountItem';
import { EmptyView } from '../../components/EmptyView';

const FavoriteReceiver = (props) => {

    const { navigation, route } = props;

    const alertRef = useRef();
    const dispatch = useDispatch();

    const unwAddress = useSelector((state) => get(state, 'walletReducer.walletInfo.unwAddress', null),);

    const [data, setData] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        // saveItemLocal(LOCAL_KEYS.FAV_ACC, []);
        getSavedAccounts();
    }, []);

    useEffect(() => {
        if (keyword) {
            // console.log('aaaaaaa', data);
            let temp = [];
            data.forEach(item => {
                if (item?.name?.toLowerCase().includes(keyword.toLowerCase())) {
                    temp.push(item);
                }
            });
            setSearchedData(temp);
            // console.log('aaaaaa', temp);
        }
    }, [keyword]);

    const getSavedAccounts = async () => {
        try {
            const savedAcc = await getLocalJson(LOCAL_KEYS.FAV_ACC);
            // console.log('ssss', savedAcc);
            if (savedAcc) {
                setData(savedAcc);
            }
        } catch (error) {

        }
    }

    const handleSelect = (item) => {
        if (route?.params?.setValue && navigation) {
            route?.params?.setValue(item?.address);
            navigation.goBack();
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 15 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{}}
                    style={{ flex: 1 }}>
                    <TextInput
                        value={keyword}
                        onChangeText={(txt) => setKeyword(txt)}
                        style={styles.input}
                        placeholder='Enter to search'
                    />
                    <View style={{ flex: 1 }}>
                        {(keyword ? searchedData : data).length > 0 ?
                            (keyword ? searchedData : data).map((item, idx) => {
                                return (
                                    <AccountItem
                                        key={item?.name}
                                        name={item?.name}
                                        address={item?.address}
                                        handleSelect={() => handleSelect(item)}
                                    // handleFavorite={() => handleFavorite(item, data[item])}
                                    />
                                );
                            })
                            :
                            <EmptyView />
                        }
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        color: COLORS.black,
        marginTop: 15,
        marginLeft: 15
    },
    input: {
        fontSize: 16,
        padding: 12,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: blackColor(.1),
        margin: 15,
    },
});

export default FavoriteReceiver;
