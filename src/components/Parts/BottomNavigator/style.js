import { StyleSheet } from 'react-native';
import { colors } from '../../../utils';
import { responsiveWidth } from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: colors.colorVariables.white,
    borderTopWidth: 1,
    borderColor: colors.colorVariables.whiteSmoke4,
    elevation: 15,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 10,
  }
})