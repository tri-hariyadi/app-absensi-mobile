import { StyleSheet, Dimensions } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import { colors, customFont } from '../../utils';

const DEVICE_HEIGHT = Dimensions.get('window').height;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.colorVariables.white
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: responsiveWidth(7),
    paddingVertical: responsiveHeight(5),
    justifyContent: 'space-evenly',
  },
  backgroundImageStyle: {
    resizeMode: 'stretch',
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
    position: 'absolute',
  },
  imageLogo: {
    height: responsiveHeight(15),
    width: responsiveWidth(28),
    resizeMode: 'contain',
  },
  text: {
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(2.5),
    color: colors.colorVariables.indigo1
  },

  //Carousel Style
  ItemRenderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: colors.colorVariables.white,
  },
  imageLogo: {
    marginTop: responsiveHeight(-5),
    width: responsiveWidth(80),
    height: responsiveHeight(45),
  },
  wrapperText: {
    paddingHorizontal: 30,
  },
  textTitle: {
    marginTop: responsiveHeight(-24),
    fontSize: responsiveFontSize(2.5),
    color: colors.colorVariables.black1,
    fontFamily: customFont.secondary[800],
    textAlign: 'center',
    marginBottom: responsiveHeight(2)
  },
  textDesc: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.9),
    color: colors.colorVariables.black1,
    fontFamily: customFont.primary[400],
    textAlign: 'center'
  },
  arrowStyle: {
    // backgroundColor: colors.colorVariables.greenLighten,
    backgroundColor: colors.colorVariables.purple1,
    padding: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    top: DEVICE_HEIGHT * 33 / 100,
    fontFamily: customFont.primary[500]
  },
  rightArrowStyle: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(2),
    color: colors.colorVariables.whiteSmoke
  }
});

export default Styles;
