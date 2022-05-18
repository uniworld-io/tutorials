import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Modal from 'react-native-modal';

import metrics from '../../config/metrics';
import {blackColor, COLORS} from '../../utils/colorHelper';
import {RegularText} from '../CustomFontText/RegularText';
import {BoldText} from '../CustomFontText/BoldText';
import {Icon} from 'native-base';
import {helpers} from '../../utils/helpers';
import {EXPLORE_URL, MESSAGES} from '../../config/constants';
import {useDispatch, useSelector} from 'react-redux';
import {TX_STATUS_MODAL_DISMISS} from '../../redux/actions/types';
import { CUSTOMIZE } from '../../config/customize';

export const TxStatusModal = ({dismissOtherModals = () => {}}) => {
  const dispatch = useDispatch();

  const {txVisible, txHash, txError} = useSelector(state => state.modalReducer);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (txVisible) {
      // console.log('err', txError);
      dismissOtherModals();
      setTimeout(() => {
        setVisible(true);
      }, 501);
    }
  }, [txVisible]);

  const handleCloseModal = () => {
    setVisible(false);
    dispatch({type: TX_STATUS_MODAL_DISMISS});
  };

  const handleNavigation = () => {
    helpers._handleLink(`${EXPLORE_URL}${txHash}`);
  };

  return (
    <Modal
      isVisible={visible}
      onDismiss={handleCloseModal}
      onBackButtonPress={() => {}}
      onBackdropPress={() => {}}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      style={{
        width: metrics.screenWidth,
        height: null,
        marginBottom: 0,
        alignSelf: 'center',
        justifyContent: 'flex-end',
      }}>
      <View style={{justifyContent: 'flex-end', flex: 1}}>
        <View style={styles.content}>
          <BoldText style={{fontSize: 32, color: COLORS.black}}>
            {txHash ? 'Done!' : 'Rejected!'}
          </BoldText>
          <RegularText style={{color: blackColor(0.5), marginVertical: 20}}>
            {txHash ? MESSAGES.SEND_UNW_SUCCESS : MESSAGES.SEND_FAIL}
          </RegularText>
          <Icon
            name={txHash ? 'check' : 'error'}
            type="MaterialIcons"
            style={{fontSize: 80, color: txHash ? '#5cb85c' : '#E15F6C'}}
          />
          {txHash ? (
            <Pressable onPress={handleNavigation} style={styles.scanBtn}>
              <RegularText style={styles.scanTxt}>
                View on UniChain Scan
              </RegularText>
            </Pressable>
          ) : (
            <RegularText style={styles.error}>
              {helpers.capitalizeFirstLetter(txError ? txError.trim() : '')}
            </RegularText>
          )}
          <Pressable onPress={handleCloseModal} style={styles.confirmBtn}>
            <BoldText style={{color: COLORS.white, fontSize: 16}}>OK</BoldText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  confirmBtn: {
    backgroundColor: CUSTOMIZE.primary_color,
    paddingHorizontal: 60,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBtn: {
    padding: 6,
  },
  scanTxt: {
    fontSize: 15,
    color: blackColor(0.7),
    textDecorationLine: 'underline',
    marginTop: 12,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
  },
});
