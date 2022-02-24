import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, RippleAnimation } from '../../../utils';
import BtnIconOnly from './BtnIconOnly';
import Styles from './style';

const Button = ({
  onPress,
  onPressIn,
  children,
  background,
  type,
  large,
  color,
  rippleColor,
  borderRadius,
  textBold,
  iconName,
  isLoading,
  BtnIcon,
  containerBtnIconStyle,
  btnWrapperStyle,
}) => {
  const maxOpacity = 0.6;
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(maxOpacity)).current;

  const onPressing = () => {
    RippleAnimation(scaleValue, opacityValue, maxOpacity)
    if (onPress) {
      onPress();
    }
  }

  if (BtnIcon) {
    return <BtnIconOnly
      type={type}
      large={large}
      onPress={onPress}
      iconName={iconName}
      rippleColor={rippleColor}
      containerBtnIconStyle={containerBtnIconStyle}
    />
  }

  if (Platform.OS === 'ios') {
    return (
      <TouchableWithoutFeedback onPress={onPressing}>
        <View style={[Styles.wrapper(borderRadius), btnWrapperStyle]}>
          <View
            onLayout={(event) => {
              setHeight(event.nativeEvent.layout.height);
              setWidth(event.nativeEvent.layout.width);
            }}
            style={[Styles.container(background, type), { paddingHorizontal: 10 }]}>
            <Animated.View
              style={Styles.animatedView(scaleValue, opacityValue, height, rippleColor, width, borderRadius)}
            />
            {isLoading ?
              <View style={Styles.wrapperLoading}>
                <ActivityIndicator size={20} color={colors.colorVariables.white} />
                <Text style={[Styles.text(color, textBold), { marginLeft: 5 }]}>Loading...</Text>
              </View>
              :
              <>
                {iconName &&
                  <Icon
                    name={iconName}
                    size={responsiveFontSize(2.8)}
                    color={colors.colorVariables.white}
                    style={Styles.icon}
                  />
                }
                <Text style={Styles.text(color, textBold)}>{children}</Text>
              </>
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <View style={[Styles.wrapper(borderRadius), btnWrapperStyle]}>
      <TouchableNativeFeedback
        onPress={onPressing}
        onPressIn={onPressIn}
        background={TouchableNativeFeedback.Ripple(
          rippleColor ? rippleColor : colors.colorVariables.white, true
        )}
      >
        <View style={Styles.container(background, type, isLoading)}>
          {isLoading ?
            <View style={Styles.wrapperLoading}>
              <ActivityIndicator size={17} color={colors.colorVariables.white} />
              <Text style={[Styles.text(color, textBold), { marginLeft: 5 }]}>Loading...</Text>
            </View>
            :
            <>
              {iconName &&
                <Icon
                  name={iconName}
                  size={responsiveFontSize(2.8)}
                  color={colors.colorVariables.white}
                  style={Styles.icon}
                />
              }
              <Text style={Styles.text(color, textBold)}>{children}</Text>
            </>
          }
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default Button;
