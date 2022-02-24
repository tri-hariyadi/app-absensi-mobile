import { StyleSheet, Platform } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { colors, customFont } from '../../../utils';

const Styles = StyleSheet.create({
  wrapper: (radiusSize, error, focused, theme) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // borderRadius: responsiveHeight(radiusSize ? radiusSize : 5),
    width: '100%',
    overflow: 'hidden'
    // paddingHorizontal: responsiveWidth(4),
    // borderWidth: focused ? 2 : 1,
    // paddingVertical: Platform.OS === 'ios' ? responsiveHeight(1.5) : 0,
    // borderColor: error ? colors.colorVariables.danger : focused ? colors.colorVariables.blue1 : colors.borderColor
  }),
  errorHelper: {
    flexDirection: 'row-reverse'
  },
  errorText: {
    color: colors.colorVariables.danger,
    textAlign: 'left',
    // marginRight: responsiveWidth(4.5),
    fontSize: responsiveFontSize(1.5),
    fontFamily: customFont.secondary[400],
  },
  input: {
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.indigo1,
    width: "100%",
    fontSize: responsiveFontSize(1.9),
    borderBottomWidth: 0,
    borderColor: 'transparent',
    paddingVertical: 13,
    paddingRight: 5,
  },
  animatedView: (scaleValue, opacityValue, color) => ({
    position: 'absolute',
    width: responsiveHeight(5),
    height: scaleValue ? responsiveHeight(5) : 0,
    borderRadius: responsiveHeight(5) / 2,
    transform: [{ scale: scaleValue }],
    opacity: opacityValue,
    backgroundColor: color ? color : colors.colorVariables.black2,
  }),
  btnFieldWrapper: {
    flex: 1,
    borderRadius: responsiveHeight(5) / 2,
    backgroundColor: 'transparent',
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnField: {
    position: 'absolute',
    right: 0,
  }
});

export default Styles;
