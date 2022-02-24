import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { colors, customFont } from "../../utils";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.white
  },
  contentWrapper: {
    paddingHorizontal: responsiveWidth(4)
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
});

export default Styles;
