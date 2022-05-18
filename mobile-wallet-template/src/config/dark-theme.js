import {DarkTheme as PaperDarkTheme} from 'react-native-paper';
import {DarkTheme as NavigationDarkTheme} from '@react-navigation/native';

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    icon: 'white'
  },
};

export default CombinedDarkTheme;
