import { StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import { colors, customFont } from '../../utils';

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.colorVariables.white,
  },
  content: (isOpen) => ({
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    justifyContent: isOpen ? 'space-evenly' : 'center',
  }),
  imageLogo: {
    width: responsiveHeight(13),
    height: '100%',
    resizeMode: 'contain',
  },
  imageLogo2: {
    width: responsiveHeight(13),
    height: responsiveHeight(13),
    resizeMode: 'contain',
  },
  backgroundImageStyle: {
    resizeMode: 'stretch',
    height: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWelcome: {
    fontFamily: customFont.secondary[700],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(4)
  },
  textDesc: {
    fontFamily: customFont.primary[400],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(1.6)
  },
  logoWrapper: {
    alignItems: 'center',
  },

  //modal style
  modalBtmWrapper: {
    marginTop: 15,
    marginHorizontal: responsiveWidth(5)
  },
  btnModalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'baseline'
  },
  textRecovery: {
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(2)
  },
  btnSubmitRecovery: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.colorVariables.bluePrimary,
    borderRadius: 10,
    flex: 1
  },
  textbtnSubmitRecovery: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.white,
  },

  //toast error
  toastWrapper: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
  },
  toastShadow: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'center',
    paddingRight: 3,
    paddingBottom: 3,
    borderRadius: 5
  },
  toastBox: {
    backgroundColor: '#FE6E6E',
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    elevation: 170,
    shadowColor: '#000'
  },
  toastText: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.7),
    color: colors.colorVariables.white,
  }
});

export default Styles;
