import {DefaultTheme as PaperDefaultTheme} from 'react-native-paper';
import {DefaultTheme as NavigationDefaultTheme} from '@react-navigation/native';
import {blackColor} from '../utils/colorHelper';

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    icon: 'black',
    background: '#ffffff',
    grey: blackColor(0.6),
  },
};

export default CombinedDefaultTheme;
