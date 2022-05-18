import React, {useState, useRef} from 'react';
import {View, SafeAreaView, Pressable, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import {useSelector} from 'react-redux';
import {blackColor, COLORS} from '../../utils/colorHelper';
import {Icon} from 'native-base';
import {SemiBoldText} from '../../components/CustomFontText/SemiBoldText';
import {BoldText} from '../../components/CustomFontText/BoldText';
import {ThinText} from '../../components/CustomFontText/ThinText';
import {ConfirmPwdModal} from '../../components/ConfirmPwdModal';
import {styles} from './styles';
import Clipboard from '@react-native-community/clipboard';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {walletUtils} from '../../utils/walletHelpers';
import * as nftApi from '../../redux/services/nft';
import {get} from 'lodash';
import {decrypt} from '../../utils/encrypt';
import {TransactionStatus} from '../../components/TransactionStatus';
import { CUSTOMIZE } from '../../config/customize';

const initTemplate = {
  to_address: '',
};

const templateValidator = Yup.object().shape({
  to_address: Yup.string('* Please add address of receiver')
    .required()
    .matches(
      /^[a-zA-Z0-9]+$/,
      'Address is not valid, only allow alphabet, number and no space',
    ),
});

const TransferNFTToken = ({navigation, route}) => {
  const {
    params: {ownerAddress, contract, token_id},
  } = route || {params: {ownerAddress: '', contract: '', token_id: ''}};
  const alertRef = useRef();
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [NFTTemplateData, setNFTTemplateData] = useState({});
  const [txSuccess, setTxSuccess] = useState(null);

  const encryptedPrivateKey = useSelector(state =>
    get(state, 'walletReducer.walletInfo.encryptedPrivateKey', null),
  );

  const onSubmit = async values => {
    setVisible(true);
    setNFTTemplateData(values);
  };

  const onConfirm = async password => {
    setVisible(false);
    try {
      const privateKey = await decrypt(encryptedPrivateKey, password);
      const tx = await nftApi.transfer(
        {
          ...NFTTemplateData,
          owner_address: ownerAddress,
          contract,
          token_id,
          to_address: walletUtils.unwAddressToHex(NFTTemplateData.to_address),
        },
        privateKey,
      );
      if (tx.result) {
        setTxSuccess({
          status: true,
          id: tx?.transaction?.txID,
          message: 'Successful!',
        });
      } else {
        setTxSuccess({
          status: false,
          message: tx?.message || 'Something went wrong!',
        });
      }
    } catch (e) {
      console.log(e);
      setTxSuccess(e.message);
    }
  };

  const onFinish = () => {
    setTxSuccess(null);
    navigation.navigate('NFT', {});
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initTemplate}
        enableReinitialize
        validationSchema={templateValidator}
        onSubmit={values => onSubmit(values)}>
        {({values, errors, handleChange, setFieldValue, handleSubmit}) => (
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAwareScrollView
              contentContainerStyle={{padding: 20}}
              style={{flex: 1}}>
              {/* Address */}
              <View>
                <SemiBoldText style={[styles.label, {marginTop: 15}]}>
                  Address
                </SemiBoldText>
                <View style={styles.amountContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.to_address}
                    selectionColor={blackColor(0.5)}
                    onChangeText={handleChange('to_address')}
                    placeholder="Address"
                  />
                  {/* Scan address */}
                  <Pressable
                    style={{paddingVertical: 9}}
                    onPress={() =>
                      navigation.navigate('WalletScanner', {
                        setValue: value => setFieldValue('to_address', value),
                      })
                    }>
                    <Icon
                      name="qr-code-outline"
                      type="Ionicons"
                      style={{
                        fontSize: 22,
                        color: '#434343',
                        marginHorizontal: 10,
                      }}
                    />
                  </Pressable>
                  {/* Copy address */}
                  <Pressable
                    style={{paddingVertical: 10}}
                    onPress={async () => {
                      const value = await Clipboard.getString();
                      setFieldValue('to_address', value);
                    }}>
                    <Icon
                      name="paste"
                      type="FontAwesome5"
                      style={{
                        fontSize: 22,
                        color: '#434343',
                        marginHorizontal: 14,
                      }}
                    />
                  </Pressable>
                </View>
                {errors.to_address && (
                  <ThinText
                    style={{
                      fontSize: 12,
                      color: 'red',
                    }}>
                    {`${errors.to_address}`}
                  </ThinText>
                )}
              </View>
              {/* Confirm Button */}
              <Pressable
                onPress={handleSubmit}
                style={{
                  ...styles.sendBtn,
                  backgroundColor: CUSTOMIZE.primary_color,
                }}>
                <BoldText style={{color: COLORS.white, fontSize: 20}}>
                  Transfer
                </BoldText>
              </Pressable>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        )}
      </Formik>
      <ConfirmPwdModal
        visible={visible}
        setVisible={setVisible}
        pwd={pwd}
        setPwd={setPwd}
        handleAction={password => onConfirm(password)}
        error={error}
        setError={setError}
      />
      <TransactionStatus tx={txSuccess} onClose={onFinish} />
      <DropdownAlert ref={alertRef} />
    </View>
  );
};

export default TransferNFTToken;
