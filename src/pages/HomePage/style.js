import { StyleSheet, Dimensions, Platform } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import { colors, customFont } from '../../utils';
const WIDTH = Dimensions.get('window').width;
const { OS } = Platform;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.white,
  },
  content: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
  },
  textGroup: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.5),
    color: colors.colorVariables.purple2,
    textTransform: 'uppercase',
    backgroundColor: colors.colorVariables.whiteSmoke3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 50
  },
  nameProfile: {
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(2.5),
    textTransform: 'capitalize',
    color: colors.colorVariables.indigo1
  },
  departmentProfile: {
    fontFamily: customFont.primary[500],
    textTransform: 'uppercase',
    color: colors.colorVariables.black2,
    flex: 1,
    flexWrap: 'wrap',
    fontSize: responsiveFontSize(1.6),
    maxWidth: '90%'
  },
  imageProfile: {
    width: responsiveHeight(10),
    height: responsiveHeight(10),
    resizeMode: 'cover',
    borderRadius: responsiveHeight(10) / 2
  },
  imageProfile2: {
    width: responsiveHeight(7.8),
    height: responsiveHeight(7.8),
    resizeMode: 'cover',
    borderRadius: responsiveHeight(7.8) / 2
  },
  card: {
    elevation: 6,
    padding: responsiveHeight(2),
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    marginHorizontal: responsiveHeight(2)
  },
  cardBodyProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: OS === 'ios' ? responsiveWidth(2.5) : 0
  },
  cardBodyTap: {
    width: '48%',
    backgroundColor: colors.colorVariables.purple1,
    padding: responsiveHeight(1.2),
    borderRadius: 5
  },
  textTap: {
    fontFamily: customFont.primary[500],
    textTransform: 'uppercase',
    color: colors.colorVariables.white,
  },
  textDay: {
    fontFamily: customFont.primary[500],
    textTransform: 'capitalize',
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(1.4),
  },
  timeAttendance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeAttendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textAttendance: {
    fontFamily: customFont.secondary[700],
    textTransform: 'uppercase',
    color: colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(2),
    textAlign: 'center'
  },
  textAttendance2: {
    fontFamily: customFont.secondary[400],
    textTransform: 'uppercase',
    color: colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(1.5),
    textAlign: 'right',
  },
  listAttendance: {
    borderBottomWidth: 1 / 2,
    borderColor: colors.colorVariables.black2,
    marginTop: 5
  },
  listAttendanceWork: {
    fontFamily: customFont.secondary[800],
    fontSize: responsiveFontSize(1.4),
    textTransform: 'uppercase',
    color: colors.colorVariables.purple2,
    textAlign: 'center'
  },
  listAttendanceDate: {
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(1.8),
    textTransform: 'capitalize',
    color: colors.colorVariables.indigo1,
    textAlign: 'center'
  },
  btnIconStyle: {
    position: 'absolute',
    bottom: 10,
    right: 12,
  },
  //Overlay Menu
  overlayMenuWrapper: {
    backgroundColor: colors.colorVariables.black2,
    position: 'absolute',
    // bottom: -WIDTH / 2,
    // right: -WIDTH / 2,
    bottom: -120,
    right: -120,
    borderRadius: WIDTH,
  },
  viewAddAttendance: {
    position: "absolute",
    top: WIDTH / 7.5,
    left: WIDTH / 4.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOut: {
    position: "absolute",
    left: WIDTH / 17,
    bottom: WIDTH / 1.87,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textViewOverlay: {
    fontFamily: customFont.secondary[700],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(1.9),
    textTransform: 'capitalize',
    // maxWidth: 50,
    position: 'absolute',
    zIndex: 999,
    right: 80,
    backgroundColor: colors.colorVariables.black2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    // borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 10,
    top: -65
  },
  textViewOverlayIzin: {
    fontFamily: customFont.secondary[700],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(1.9),
    textTransform: 'capitalize',
    position: 'absolute',
    zIndex: 999,
    right: 90,
    backgroundColor: colors.colorVariables.black2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    // borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 10,
    bottom: -30
  },
  errorDataContainer: {
    flex: 1,
    alignItems: 'center'
  },
  iconNoData: {
    width: responsiveWidth(30),
    height: responsiveWidth(30)
  },
  textNoData: {
    fontFamily: customFont.secondary[700],
    textTransform: 'capitalize',
    color: colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(2.6),
    marginTop: 12
  }
});

export default Styles;
