import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, TouchableNativeFeedback, Animated, Platform, TouchableWithoutFeedback } from 'react-native'
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { colors, RippleAnimation } from '../../../utils';

const ListItem = ({
  onPress,
  children,
  rippleColor,
  borderRadius,
  styleWrapper,
  onLongPress
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

  const OnLongPress = () => {
    if (onLongPress) onLongPress();
  }

  if (Platform.OS === 'ios') {
    return (
      <TouchableWithoutFeedback onPress={onPressing}>
        <View style={Styles.wrapper}>
          <View
            onLayout={(event) => {
              setHeight(event.nativeEvent.layout.height);
              setWidth(event.nativeEvent.layout.width);
            }}>
            <Animated.View
              style={Styles.animatedView(scaleValue, opacityValue, height, rippleColor, width, borderRadius)}
            />
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <View style={Styles.wrapper}>
      <TouchableNativeFeedback
        onPress={onPressing}
        onLongPress={OnLongPress}
        background={TouchableNativeFeedback.Ripple(
          rippleColor ? rippleColor : colors.colorVariables.ripple
        )}>
        <View style={[{
          paddingHorizontal: 15,
          paddingVertical: 0
        }, styleWrapper]}>
          {children}
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default ListItem

const Styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    alignSelf: 'stretch',
    // borderRadius: responsiveHeight(16),
    // backgroundColor: 'yellow'
  },
  animatedView: (scaleValue, opacityValue, height, rippleColor, width, borderRadius) => ({
    position: 'absolute',
    width: width ? width : height,
    height: scaleValue ? height : 0,
    borderRadius: (typeof borderRadius === "number")
      ? borderRadius > 0
        ?
        borderRadius : height / 2
      : borderRadius ? height / 2 : 0,
    transform: [{ scale: scaleValue }],
    opacity: opacityValue,
    backgroundColor: rippleColor ? rippleColor : colors.colorVariables.white,
    top: 0,
    left: 0,
    zIndex: 2
  }),
})
