import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import { customFont, colors } from '../../utils';

const Style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.whiteSmoke,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageLogo: {
    width: responsiveHeight(110),
    height: responsiveWidth(28),
    resizeMode: 'contain'
  },
  textLogo: {
    fontFamily: customFont.secondary[800],
    color: colors.colorVariables.blueDark,
    fontSize: responsiveFontSize(4),
    marginTop: responsiveHeight(3),
  }
});

export default Style;
