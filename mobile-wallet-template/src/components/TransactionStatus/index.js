import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import metrics from '../../config/metrics';
import {blackColor, COLORS} from '../../utils/colorHelper';
import {RegularText} from '../CustomFontText/RegularText';
import {BoldText} from '../CustomFontText/BoldText';
import {Icon} from 'native-base';
import {helpers} from '../../utils/helpers';
import {EXPLORE_URL, MESSAGES} from '../../config/constants';
import { CUSTOMIZE } from '../../config/customize';

export const TransactionStatus = ({tx, onClose}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!tx) {
      return () => {};
    }
    if (tx?.status) {
      setTimeout(() => {
        setVisible(true);
      }, 501);
    } else {
      setTimeout(() => {
        setVisible(false);
      }, 501);
    }
    return () => {};
  }, [tx]);

  const handleNavigation = () => {
    helpers._handleLink(`${EXPLORE_URL}${tx?.id}`);
  };

  const onOK = () => {
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 500);
  };

  return (
    <Modal
      isVisible={visible}
      onDismiss={onOK}
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
      {tx ? (
        <View style={{justifyContent: 'flex-end', flex: 1}}>
          <View style={styles.content}>
            <BoldText style={{fontSize: 32, color: COLORS.black}}>
              {tx?.status ? 'Done!' : 'Rejected!'}
            </BoldText>
            <RegularText style={{color: blackColor(0.5), marginVertical: 20}}>
              {tx?.status ? MESSAGES.SEND_UNW_SUCCESS : MESSAGES.SEND_FAIL}
            </RegularText>
            <Icon
              name={tx?.status ? 'check' : 'error'}
              type="MaterialIcons"
              style={{fontSize: 80, color: tx?.status ? '#5cb85c' : '#E15F6C'}}
            />
            {tx?.id ? (
              <Pressable onPress={handleNavigation} style={styles.scanBtn}>
                <RegularText style={styles.scanTxt}>
                  View on UniChain Scan
                </RegularText>
              </Pressable>
            ) : (
              <RegularText style={styles.error}>
                {helpers.capitalizeFirstLetter(tx?.message)}
              </RegularText>
            )}
            <Pressable onPress={onOK} style={styles.confirmBtn}>
              <BoldText style={{color: COLORS.white, fontSize: 16}}>
                OK
              </BoldText>
            </Pressable>
          </View>
        </View>
      ) : null}
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
