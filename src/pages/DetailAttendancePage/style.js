import { StyleSheet, Dimensions } from 'react-native';
import { colors, customFont } from '../../utils';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
const DEVICE_WIDTH = Dimensions.get('window').width;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.indigo1,
    justifyContent: 'space-between',
  },
  content: {
    marginHorizontal: responsiveWidth(4),
  },
  textSection: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.blueLighten1,
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
  wrapperMap: {
    // ...StyleSheet.absoluteFillObject,
    height: responsiveHeight(28),
    width: DEVICE_WIDTH * 92.3 / 100,
    marginHorizontal: responsiveWidth(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    backgroundColor: 'yellow',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.colorVariables.whiteSmoke2
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'red',
  },
  pinText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  btnCaptureContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(10),
    backgroundColor: colors.colorVariables.indigo1,
  },
  btnCaptureWrapper: {
    position: 'relative',
    top: responsiveHeight(9.2),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    alignSelf: 'center',
  },
  btnTakeWrapper: {
    padding: responsiveHeight(1.2),
    backgroundColor: 'white',
    borderRadius: 100,
  },
  containerBtnIconStyle: {
    position: "relative",
    alignSelf: 'center',
    elevation: 7,
    zIndex: 2
  },
  textCapture: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.white,
  },
  bottomMenuWrapper: {
    flex: 1,
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  btnRetake: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  //ModalStyle
  modal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: colors.colorVariables.black2
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
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
    maxHeight: '75%',
    overflow: 'hidden'
  },
  modalTitle: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2.3),
    textAlign: "center"
  },
  rowText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: responsiveFontSize(1.9),
    color: '#000',
    backgroundColor: 'white',
    textAlignVertical: 'center'
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapperBoxSearch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.colorVariables.black4,
    marginHorizontal: 28,
    paddingHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 0,
  },
  textErrorFingerScann: (error) => ({
    fontFamily: customFont.secondary[400],
    color: error ? colors.colorVariables.danger : colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(1.6),
    textAlign: "center"
  })
});

export default Styles;
