import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { colors, customFont } from '../../utils';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.white
  },
  content: {
    paddingHorizontal: responsiveWidth(3.5),
  },
  headerView: {
    position: 'absolute',
    width: '100%',
    zIndex: 12,
    backgroundColor: colors.colorVariables.whiteSmoke3
  },

  //Filter Date
  filterContainer: {
    backgroundColor: colors.colorVariables.white,
  },
  filterWrapContainer: {
    backgroundColor: colors.colorVariables.whiteSmoke3,
    padding: 10,
  },
  filterDateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  filterDateInput: {
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  contentDateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  errorHelper: {
    color: colors.colorVariables.danger,
    fontSize: 10,
    marginLeft: 1
  },
  loadingTable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 50
  },
  btnLoadMore: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.colorVariables.blue1,
    marginTop: 10,
    borderRadius: 3,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textLoadMore: {
    textAlign: 'center',
    color: colors.colorVariables.white,
    fontFamily: customFont.secondary[400],
    fontSize: responsiveFontSize(1.8)
  },

  //textValue
  valueInput: (value) => ({
    color: value ? colors.colorVariables.black : colors.borderColor,
    fontFamily: customFont.secondary[400]
  }),

  //Btn Excel
  btnExcel: {
    backgroundColor: '#29A746',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: responsiveWidth(3.5)
  },

  //separatorListView
  separatorList: {
    height: 0.9,
    width: '100%',
    marginLeft: 10,
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  //itemListView
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: colors.colorVariables.white,
  },
  imgWrapp: {
    marginLeft: responsiveWidth(3.5)
  },
  imageList: {
    width: responsiveHeight(7),
    height: responsiveHeight(7),
    resizeMode: 'cover',
    borderRadius: responsiveHeight(7) / 2,
  },
  attWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: responsiveWidth(3.5)
  },
  WrappTime: {
    justifyContent: 'flex-start',
  },
  textAttendance: {
    fontFamily: customFont.secondary[700],
    textTransform: 'uppercase',
    color: colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(2),
    textAlign: 'right',
    fontSize: responsiveFontSize(1.8)
  },
  textAttType: (status) => ({
    color: status === 1 ? colors.colorVariables.greenLightDark1 : colors.colorVariables.danger
  }),
  textDay: {
    fontFamily: customFont.primary[500],
    textTransform: 'capitalize',
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(1.4),
  },

  //Detail Style
  detailHeader: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  detaiHeadWrappTxt: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameWrapp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: (status) => ({
    fontFamily: customFont.primary[500],
    textTransform: 'capitalize',
    color: status === 'check' ? colors.colorVariables.black : colors.colorVariables.white,
    fontSize: responsiveFontSize(1.4),
    backgroundColor: status === '2' ? colors.colorVariables.greenLightDark1 :
      status === '3' ? colors.colorVariables.danger : colors.colorVariables.yellowDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'flex-start',
  }),
  textName: {
    color: colors.colorVariables.black,
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(1.9),
    flexWrap: 'wrap',
    flex: 1,
    alignSelf: 'flex-start',
    textTransform: 'capitalize'
  },
  textDivision: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.5),
    color: '#A5B1C0',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    maxWidth: '70%',
    textTransform: 'uppercase'
  },

  //Item Detail
  lineBottomModal: {
    height: 1.4,
    width: '100%',
    backgroundColor: colors.colorVariables.black4,
    marginTop: 8
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10
  },
  itemDetailName: {
    color: colors.colorVariables.black,
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(1.9),
    flexWrap: 'wrap',
    flex: 1,
    marginVertical: 2
  },
  itemDetailSeparator: {
    fontFamily: customFont.secondary[800],
    marginHorizontal: 5
  },
  itemDetailValue: {
    color: colors.colorVariables.black,
    fontFamily: customFont.secondary[400],
    fontSize: responsiveFontSize(1.9),
    flexWrap: 'wrap',
    flex: 1.5,
    marginLeft: 10,
    marginVertical: 2,
    textAlign: 'justify'
  },

  //Style Loading Indicator 
  LoadingSpinner: {
    width: responsiveHeight(13),
    height: responsiveHeight(13)
  },
  LoadingText: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2.5),
    marginTop: 8
  },
  textEmpty: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2),
  },
  emptyItemView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(10)
  },
});

export default Styles;
