import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import {
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { colors, customFont } from '../../../utils';

const LoadingScreen = ({ show }) => {
  if (!show) return null;
  return (
    <View style={Styles.container}>
      <ActivityIndicator size={38} color={colors.colorVariables.purple2} />
      <Text style={Styles.textLoading}>Loading...</Text>
    </View>
  );
}

export default LoadingScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
  },
  textLoading: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(2.2),
    marginTop: responsiveHeight(2),
  }
})
