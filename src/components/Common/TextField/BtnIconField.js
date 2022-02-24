import React, { useRef } from 'react';
import { View, TouchableWithoutFeedback, Animated } from 'react-native';
import { responsiveFontSize } from "react-native-responsive-dimensions";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, RippleAnimation } from '../../../utils';
import Styles from './style';

const BtnIconField = ({ iconName, onPress, color, iconColor }) => {
  const maxOpacity = 0.8;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(maxOpacity)).current;

  const onButtonPressed = () => {
    setTimeout(() => {
      if (onPress) onPress();
    }, 200);
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={() => RippleAnimation(scaleValue, opacityValue, maxOpacity)}
      onPress={onButtonPressed}>
      <View style={Styles.btnFieldWrapper}>
        <Animated.View
          style={Styles.animatedView(scaleValue, opacityValue, color)}
        />
        {iconName &&
          <Icon
            name={iconName}
            size={responsiveFontSize(3)}
            color={iconColor || colors.colorVariables.black3}
          />
        }
      </View>
    </TouchableWithoutFeedback>
  )
}

export default BtnIconField;
