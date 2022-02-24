import { StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import { colors, customFont } from '../../utils';

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.colorVariables.white,
  },
  content: {
    paddingTop: responsiveHeight(4),
  },
  profileSection: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: colors.colorVariables.purple2
  },
  imageProfile: {
    width: responsiveHeight(15),
    height: responsiveHeight(15),
    resizeMode: 'cover',
    borderRadius: responsiveHeight(15) / 2
  },
  iconAddPhotoWrapper: {
    backgroundColor: colors.colorVariables.greenLighten2,
    alignSelf: 'center',
    position: 'absolute',
    padding: 6,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    right: 0
  },
  textName: {
    fontFamily: customFont.secondary[800],
    textTransform: 'capitalize',
    fontSize: responsiveFontSize(3),
    color: colors.colorVariables.purple2
  },
  textGroup: {
    fontFamily: customFont.secondary[700],
    textTransform: 'uppercase',
    fontSize: responsiveFontSize(2.3),
    color: colors.colorVariables.indigo1
  },
  textGroup2: {
    fontFamily: customFont.secondary[600],
    textTransform: 'uppercase',
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.indigo1,
    textAlign: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    borderRadius: 2000,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.colorVariables.greenLighten,
    padding: responsiveHeight(1.5),
    marginTop: responsiveWidth(9),
  },



  //ModalStyle
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colorVariables.black4,
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(7),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 6,
    width: '85%',
  },
  modalTitle: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2.3),
    textAlign: "center"
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: responsiveWidth(4),
    elevation: 2,
    backgroundColor: colors.colorVariables.redLighten1
  },
  modalTextButton: {
    textAlign: "center",
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(2)
  },
  textErrorFingerScann: (error) => ({
    fontFamily: customFont.secondary[400],
    color: error ? colors.colorVariables.danger : colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(1.6),
    textAlign: "center"
  }),
  imageLogo2: {
    width: responsiveHeight(11),
    height: responsiveHeight(11),
    resizeMode: 'contain',
  },
  badge: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    backgroundColor: colors.colorVariables.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(6) / 2,
    position: 'absolute',
    top: 0,
    right: -6,
    padding: 1
  },
  badgeItem: {
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(1.9),
    marginTop: -1,
    fontFamily: customFont.primary[600]
  }
});

export default Styles;
