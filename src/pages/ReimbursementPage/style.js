import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { colors, customFont } from '../../utils';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF1F5',
  },
  content: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.5),
    backgroundColor: colors.colorVariables.purple1
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
    borderRadius: 50,
    backgroundColor: colors.colorVariables.white
  },
  shapeView: {
    backgroundColor: colors.colorVariables.purple1,
    width: '100%',
    position: 'absolute',
    height: '40%'
  },

  //Style Card
  card: {
    elevation: 6,
    padding: responsiveHeight(2),
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    marginHorizontal: responsiveWidth(4)
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupCardItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticleLine: {
    width: 0.8,
    height: '100%',
    backgroundColor: colors.colorVariables.black4,
  },
  textMoney: {
    fontFamily: customFont.primary[700],
    fontSize: responsiveFontSize(2.3),
    color: colors.colorVariables.greenLightDark1,
  },
  textDesc: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.7),
    color: colors.colorVariables.grey1,
  },
  textDetailCard: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.greenLightDark1,
  },
  wrapperIncomePerMounth: {
    borderTopWidth: 0.8,
    borderColor: colors.colorVariables.black4
  },

  //Button Apply Reimburse Style
  btnAddReimbursement: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //Text History Style
  historyWrapper: {
    paddingHorizontal: responsiveWidth(1.5),
  },
  textHistory: {
    color: colors.colorVariables.black2,
    fontSize: responsiveFontSize(2.1)
  },

  //Content Wrapper
  contentWrapper: {
    marginHorizontal: responsiveWidth(4),
  },

  //separatorListView
  separatorList: {
    height: 1,
    width: '100%',
    backgroundColor: colors.borderColor,
  },

  //Filter ItemView
  filter: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C9F5DE',
    borderColor: colors.colorVariables.greenLightDark1,
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  filterText: {
    fontFamily: customFont.secondary[800],
    fontSize: responsiveFontSize(1.7),
    marginRight: 5,
    color: '#51D394'
  },

  //itemListView
  itemView: (idx, length) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5.5),
    paddingVertical: 15,
    backgroundColor: colors.colorVariables.white,
    borderTopRightRadius: idx === 0 ? 15 : 0,
    borderTopLeftRadius: idx === 0 ? 15 : 0,
    borderBottomRightRadius: idx === length - 1 ? 5 : 0,
    borderBottomLeftRadius: idx === length - 1 ? 5 : 0,
    elevation: idx === 0 ? 20 : 0,
    shadowColor: '#52006A',
  }),
  itemViewIcon: {
    alignItems: 'flex-start',
    height: '100%',
    marginRight: 15
  },
  itemViewIconWrapper: {
    backgroundColor: '#CCDDFF',
    padding: 8,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemViewData: {
    flex: 1
  },
  itemViewStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15
  },
  itemViewText: {
    flexWrap: 'wrap',
    flex: 1,
  },
  itemViewTextUName: {
    fontFamily: customFont.secondary[800],
    fontSize: responsiveFontSize(1.9)
  },
  itemViewTextName: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.6),
    color: '#A5B1C0',
    marginTop: 5
  },
  itemViewBadge: (status) => ({
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: status === 'accept' ? colors.colorVariables.greenLightDark1 :
      status === 'processing' ? colors.colorVariables.yellowDark : colors.colorVariables.danger,
    color: status === 'processing' ? colors.colorVariables.black : colors.colorVariables.white,
    borderRadius: 200,
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.5),
  }),

  //Button Load More Style
  btnLoadMore: {
    backgroundColor: colors.colorVariables.blue1,
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textBtnLoadMore: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.white
  },

  //Modal Style
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  ModalContainer: {
    backgroundColor: 'white',
    paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  topLineModal: {
    height: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  lineModal: {
    height: 4,
    backgroundColor: colors.colorVariables.black4,
    width: 50,
    borderRadius: 20
  },
  lineBottomModal: {
    height: 1.4,
    width: '100%',
    backgroundColor: colors.colorVariables.black4
  },
  headerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10
  },
  textHeaderDetail: {
    fontFamily: customFont.secondary[700],
    color: colors.colorVariables.black,
    fontSize: responsiveFontSize(2.1)
  },

  //Table Style
  detailItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  itemName: {
    color: colors.colorVariables.black,
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(1.9),
    flexWrap: 'wrap',
    flex: 1,
    marginVertical: 2
  },
  itemValue: {
    color: colors.colorVariables.black,
    fontFamily: customFont.secondary[400],
    fontSize: responsiveFontSize(1.9),
    flexWrap: 'wrap',
    flex: 1.5,
    marginLeft: 10,
    marginVertical: 2,
    textAlign: 'justify'
  },
  itemSeparator: {
    fontFamily: customFont.secondary[800],
    marginHorizontal: 5
  },
  btnDone: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    margin: 10,
    backgroundColor: colors.colorVariables.purple1,
    borderRadius: 8,
    flex: 1
  },
  btnConfirmAndDelete: {
    backgroundColor: colors.colorVariables.danger
  },
  textBtnDone: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: colors.colorVariables.white,
  },

  //Modal Date Picker Style
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colorVariables.black4
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(8),
    alignItems: "center",
    shadowColor: "#000",
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
    textAlign: "center"
  },
  btnModalWrapper: {
    flexDirection: 'row',
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

  //List Empty Style Component
  emptyItemView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  textEmpty: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2),
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
  }
});

export default Styles;
