import {StyleSheet} from 'react-native';
import {COLORS} from '../../utils/colorHelper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 15,
  },
  btn: {
    flex: 1,
    backgroundColor: '#F5F5F6',
    borderRadius: 2,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftCurrency: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
  },
  label: {
    fontSize: 13,
    color: '#525B6B',
  },
  input: {
    paddingVertical: 12,
    paddingLeft: 14,
    color: COLORS.black,
    flex: 1,
    fontWeight: '500',
    fontSize: 15,
  },
  currencyContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#CFCFCF',
  },
  amountContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFCFCF',
    overflow: 'hidden',
  },
  timeContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFCFCF',
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingRight: 14,
  },
  unwBox: {
    backgroundColor: '#E9ECEF',
    height: '100%',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  unwTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 35,
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
    paddingLeft: 5,
  },
});
