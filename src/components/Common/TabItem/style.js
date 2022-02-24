import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { colors, customFont } from '../../../utils';

export const styles = StyleSheet.create({
  container: (width) => ({
    alignItems: 'center',
    paddingVertical: 8,
    overflow: 'hidden',
    paddingHorizontal: responsiveHeight(3),
    // backgroundColor: 'yellow',
  }),
  text: (colorValue) => ({
    fontSize: responsiveFontSize(1.4),
    color: colorValue ? colors.colorVariables.purple2 : colors.colorVariables.black,
    fontFamily: customFont.secondary[600],
    marginTop: 3,
    minWidth: '15%',
    textAlign: 'center',
  }),
  animatedView: (scaleValue, opacityValue, width, height) => ({
    position: 'absolute',
    width: width,
    height: scaleValue ? width : 0,
    borderRadius: width / 2,
    transform: [{ scale: scaleValue }],
    opacity: opacityValue,
    backgroundColor: colors.colorVariables.black2,
    top: -(width - height) / 2,
  }),
  badge: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    backgroundColor: colors.colorVariables.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(4) / 2,
    position: 'absolute',
    top: -5,
    right: -10,
    padding: 1
  },
  badgeItem: {
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(1.7),
    marginTop: -1
  }
})