import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { colors, customFont } from '../../../utils';

const Styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: responsiveHeight(2),
  },
  wrapperLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: customFont.primary[600],
    color: colors.colorVariables.black1
  },
  textDaftar: (isPress) => ({
    fontSize: responsiveFontSize(1.6),
    fontFamily: customFont.primary[600],
    marginLeft: 8,
    color: isPress ? colors.colorVariables.greenLighten : colors.colorVariables.redLight1,
  }),
  wrapperLinkIcon: {
    flexDirection: 'row',
  },
});

export default Styles;
