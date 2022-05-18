import React, {Suspense} from 'react';
import {useSelector} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {Root, Text} from 'native-base';

import RootNavigation from './navigation/index';
import CombinedDarkTheme from './config/dark-theme';
import CombinedDefaultTheme from './config/default-theme';

const AppContainer = () => {
  const isDark = useSelector((state) => state.themeReducer.isDark);
  const combinedTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;
  //   const paperTheme = isDark ? PaperDarkTheme : PaperDefaultTheme;

  return (
    <Suspense fallback={null}>
      <Root>
        <PaperProvider theme={combinedTheme}>
          <RootNavigation theme={combinedTheme} />
        </PaperProvider>
      </Root>
    </Suspense>
  );
};

export default AppContainer;
