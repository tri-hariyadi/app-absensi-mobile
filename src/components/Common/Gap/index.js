import React from 'react';
import { View } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const Gap = ({height, width}) => {
  return (
    <View
      style={{
        height: height ? responsiveHeight(height) : 0,
        width: width ? responsiveWidth(width) : 0,
      }}></View>
  );
};

export default Gap;
