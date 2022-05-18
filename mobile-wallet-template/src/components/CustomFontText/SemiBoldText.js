import React from 'react';
import {Text, StyleSheet} from 'react-native';
// import fontStyles from '../../config/font-styles';

export const SemiBoldText = ({
  children,
  style = {},
  numberOfLines = 10,
  ellipsizeMode = 'tail',
  ...props
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[styles.defaultStyle, style]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    fontWeight: '500',
    // fontFamily: fontStyles.regular
  },
});
