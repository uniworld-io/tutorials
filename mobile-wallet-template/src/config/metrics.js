/*
 * platform/application wide metrics for proper styling
 */
import { Dimensions, Platform } from 'react-native';
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';

const { width, height } = Dimensions.get('window');

const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === 'ios' ? 54 : 66,
  statusBar: getStatusBarHeight(),
  bottomSpace: getBottomSpace(),
};

export default metrics;
