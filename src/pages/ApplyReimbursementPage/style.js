import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { colors, customFont, normalizePrice } from '../../utils';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.white
  },
  content: {
    marginHorizontal: responsiveWidth(6),
  },
  textSection: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.purple1,
    textTransform: 'uppercase',
  },
  detailLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: responsiveWidth(4),
  },
  textAddress: {
    fontFamily: customFont.secondary[400],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.indigo1,
    marginLeft: responsiveWidth(2)
  },
  itemAddPhoto: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: colors.colorVariables.whiteSmoke4,
  },
  photoWrapper: {
    borderWidth: 3,
    borderRadius: 3,
    borderColor: colors.colorVariables.green2,
    opacity: 1
  },

  //Card Proof
  card: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: colors.borderColor
  },
  cardHeader: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: colors.borderColor
  },
  labelUpload: {
    fontFamily: customFont.primary[600],
    color: colors.colorVariables.indigo1
  },
  labelChangeDocument: {
    fontFamily: customFont.secondary[800],
    fontSize: responsiveFontSize(1.7),
    color: colors.colorVariables.greenLightDark1
  },
  labelDesc: {
    fontFamily: customFont.secondary[800],
    fontSize: responsiveFontSize(1.7),
    color: colors.colorVariables.black3,
    marginBottom: 6
  },
  labelUploadPhoto: {
    fontFamily: customFont.secondary[800],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.black3,
    marginTop: 4,
  },

  //ModalStyle
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorVariables.black4
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(8),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 6,
    width: '85%'
  },
  modalTitle: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2.3),
    textAlign: 'center'
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: responsiveWidth(4),
    elevation: 2,
    backgroundColor: colors.colorVariables.redLighten1
  },
  modalTextButton: {
    textAlign: 'center',
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(2)
  },
});

export default Styles;
