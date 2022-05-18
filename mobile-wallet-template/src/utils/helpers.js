import {Platform, Linking, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  getBottomSpace,
  getStatusBarHeight,
  isIphoneX,
} from 'react-native-iphone-x-helper';
import * as _ from 'lodash';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import ExactMath from 'exact-math';
import numeral from 'numeral';
import moment from 'moment';
import {ITEM_PER_PAGE} from '../config/constants';
import {findIndex, forEach, includes} from 'lodash';
import {binaryMd5} from 'react-native-quick-md5';
import CryptoJS from 'react-native-crypto-js';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';

const isIOS = Platform.OS === 'ios';
const isTablet = DeviceInfo.isTablet();
const isIpX = isIphoneX();
const bottomSpace = getBottomSpace();
const statusBarHeight = getStatusBarHeight();

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

function validatePrivateKey(str) {
  const regexFile = new RegExp(/^[0-9a-fA-F]{64}/);
  return regexFile.test(str);
}

const validatePhone = phone => {
  const regexPhone = new RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  );
  return regexPhone.test(phone);
};

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

const validatePwd = pwd => {
  const regexPassword = new RegExp(
    /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/,
  );
  return regexPassword.test(pwd);
};

const removeHexPrefix = key => {
  return key.slice(0, 2) == '0x' ? key.slice(2) : key;
};

const validateEmail = email => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const convertPhone = phone => {
  const temp = '84';
  return '+'.concat(temp.concat(phone.replace(/^0+/, '').trim()));
};

const elevationShadowStyle = elevation => {
  return {
    elevation,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5 * elevation},
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
};

const isEmpty = str => {
  return _.isEmpty(str.trim());
};

const _handleLink = async url => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    alert(`Incorrect url: ${url}`);
  }
};

const convertDate = time => {
  const temp = time.split('T');
  const new_time = temp[0].split('-');
  if (new_time.length === 3) {
    return new_time[2] + '/' + new_time[1] + '/' + new_time[0];
  } else {
    return temp[0];
  }
};

const getDateFromEpochTime = time => {
  if (!time) {
    return '';
  }
  return moment(time).format('lll');
};

const convertTime = seconds => {
  const m = parseInt(seconds / 60);
  const s = parseInt(seconds % 60);
  return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
};

const formatNumber = num => {
  if (!num) {
    return 0;
  }
  return ExactMath.add(num / 1000000, 0);
};

const formatCurrency = num => {
  if (!num) {
    return '0';
  }
  if (isFloat(num)) {
    return numeral(num).format('0,0.000');
  }
  return numeral(num).format('0,0');
};

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

const formatCurrencyWith6 = num => {
  if (!num) {
    return '0';
  }
  if (isFloat(num)) {
    return numeral(num).format('0,0.000000');
  }
  return numeral(num).format('0,0');
};

// Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
function reduceFraction(numerator, denominator) {
  var gcd = function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  };
  gcd = gcd(numerator, denominator);
  return [numerator / gcd, denominator / gcd];
}

const handleCopyToClipboard = (
  content = '',
  toast = 'Copied',
  gravity = Toast.BOTTOM,
) => {
  Clipboard.setString(content);
  Toast.showWithGravity(toast, Toast.SHORT, gravity);
};

const convertMiliSecToTime = time => {
  if (time > 0) {
    let day = parseInt(time / (24 * 60 * 60));
    let hour = parseInt((time - 24 * 60 * 60 * day) / (60 * 60));
    let minute = parseInt((time - 24 * 60 * 60 * day - 60 * 60 * hour) / 60);
    let second = time - 24 * 60 * 60 * day - 60 * 60 * hour - minute * 60;
    if (day > 0) {
      day = appendOx(day) + 'd:';
    } else {
      day = '';
    }
    if (hour > 0) {
      hour = appendOx(hour) + 'h:';
    } else {
      hour = '';
    }
    if (minute > 0) {
      minute = appendOx(minute) + 'm:';
    } else {
      minute = '';
    }
    if (second > 0) {
      second = appendOx(second) + 's';
    } else {
      second = '';
    }
    return `${day}${hour}${minute}${second}`.trim();
  }
  return '';
};

const appendOx = val => {
  if (val > 0 && val < 10) {
    return '0' + val;
  } else if (val >= 10) {
    return val;
  } else {
    return '';
  }
};

export const getCurrentDate = () => {
  return moment().format('Do MMM YYYY');
};

const formatNumber2 = num => {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return num;
};

const formatNumberWithPrecision = (amount, precision) => {
  return Number(amount) / 10 ** precision;
};

const convertHexToAscii = str1 => {
  var hex = str1.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

const validateConversionRatio = conversionRatio => {
  const regexConversionRatio = new RegExp(/\d+:\d+/g);
  return regexConversionRatio.test(conversionRatio);
};

const validateUrl = url => {
  const regexUrl = new RegExp(/(^http[s]?:\/{2})|(^www)|(^\/{1,2})/gim);
  return regexUrl.test(url);
};

const getRatioUNW = str => {
  if (typeof str === 'string') {
    str = str.trim();
    let arr = str.split(':');
    return {
      tokenRatio: parseInt(arr[0]),
      unxRatio: parseInt(arr[1]),
    };
  }
  return null;
};

const readableDate = d => {
  if (!d) {
    return undefined;
  }
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(
    d.getDate(),
  )} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

function pad2(string) {
  return `0${string}`.slice(-2);
}

function formatAmount(amount, pow = 2) {
  let amount1 = Number(amount).toFixed(pow);
  amount1 = Math.round(amount1 * Math.pow(10, pow)) / Math.pow(10, pow);
  amount1 = String(amount1);
  if (amount1.indexOf('.') < 0) {
    amount1 = amount1 + '.';
    return String(amount1)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
      .replace('.', '');
  } else {
    return String(amount1).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
}

function formatUnw(amount) {
  return Number(amount) / 10 ** 6;
}

const handleError = err => {
  if (!err) {
    return '';
  }
  const errArr = err.split(':');
  let temp = '';
  if (errArr.length > 1) {
    for (let i = 1; i < errArr.length; i++) {
      temp += `${errArr[i]} `;
    }
  }
  return temp;
};

const getTotalPage = total => {
  if (total % ITEM_PER_PAGE === 0) {
    return total / ITEM_PER_PAGE;
  }
  return Math.floor(total / ITEM_PER_PAGE) + 1;
};

function capitalizeFirstLetter(string) {
  if (!string) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncateAbbr(str) {
  if (!str) {
    return '';
  }
  return str.slice(0, 3);
}

function validateExistingAdd(add, arr) {
  if (!add || !arr) {
    return true;
  }
  if (findIndex(arr, {address: add}) > -1) {
    return true;
  }
  return false;
}

const uuid = () => Math.random().toString(36).substring(2, 12);

const md5 = async (file, cb) => {
  const data = await RNFS.readFile(file.uri, 'base64');
  const blob = Buffer.from(data, 'base64').buffer;
  const ret = binaryMd5(blob);
  cb(ret);
};

export const helpers = {
  validateExistingAdd,
  truncateAbbr,
  capitalizeFirstLetter,
  getTotalPage,
  handleError,
  formatAmount,
  formatUnw,
  isTablet,
  isIOS,
  isIpX,
  readableDate,
  convertHexToAscii,
  formatCurrency,
  validatePwd,
  validatePhone,
  elevationShadowStyle,
  isEmpty,
  validateEmail,
  convertPhone,
  _handleLink,
  convertDate,
  getCurrentDate,
  convertTime,
  formatNumber,
  handleCopyToClipboard,
  bottomSpace,
  statusBarHeight,
  removeHexPrefix,
  convertMiliSecToTime,
  formatNumber2,
  formatNumberWithPrecision,
  validateConversionRatio,
  validateUrl,
  getRatioUNW,
  formatCurrencyWith6,
  validatePrivateKey,
  getDateFromEpochTime,
  isNumber,
  isFloat,
  reduceFraction,
  uuid,
  md5,
};
