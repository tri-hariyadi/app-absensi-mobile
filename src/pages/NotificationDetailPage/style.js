import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { colors, customFont } from '../../utils';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.white,
  },
  header: {
    backgroundColor: colors.colorVariables.purple1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: responsiveWidth(2),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  backBtn: {
    overflow: 'hidden',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200
  },
  backBtnItem: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHeaderWrapp: {
    flexDirection: 'row',
    // flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  iconWrapp: {
    // padding: 5,
    width: responsiveFontSize(3.5) + 15,
    height: responsiveFontSize(3.5) + 15,
    backgroundColor: colors.colorVariables.redLight1,
    borderRadius: (responsiveFontSize(3.5) + 15) / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textTitle: {
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(2.1),
    color: colors.colorVariables.white,
    marginLeft: 8
  },
  textBody: {
    fontFamily: customFont.secondary[400],
    fontSize: responsiveFontSize(1.7),
    color: colors.colorVariables.redLight2,
    marginLeft: 8
  },
  textSubject: {
    flex: 1,
    flexWrap: 'nowrap',
    fontSize: responsiveFontSize(1.7),
    color: colors.colorVariables.redLight2,
  },
  textSubjectWrapper: {
    marginLeft: 8,
    alignSelf: 'stretch',
    height: responsiveFontSize(2.5),
    overflow: 'hidden',
  },
  headerRightSeparator: {
    position: 'absolute',
    width: responsiveWidth(5),
    top: 0,
    bottom: 0,
    backgroundColor: colors.colorVariables.purple1,
    right: 0,
    borderBottomRightRadius: 20,
  }
})

export default Styles;
