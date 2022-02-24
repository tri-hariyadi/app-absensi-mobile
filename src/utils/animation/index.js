import { Animated, Easing, Platform } from 'react-native';

export const AnimateLogo = {
  0: {
    opacity: 0,
    scale: 0,
    translateY: 2000,
  },
  0.5: {
    opacity: 0.5,
    scale: 0.3,
    translateY: -200,
  },
  0.7: {
    opacity: 0.5,
    scale: 0.6,
    translateY: -400,
  },
  1: {
    opacity: 1,
    scale: 1,
    translateY: 0,
  }
}


export const RippleAnimation = (scaleValue, opacityValue, maxOpacity) => {
  const scaleAnimation = Animated.spring(scaleValue, {
    toValue: 1,
    duration: 225,
    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    useNativeDriver: Platform.OS === 'android',
  });

  const opacityAnimation = Animated.timing(opacityValue, {
    toValue: 0,
    useNativeDriver: Platform.OS === 'android',
  });

  Animated.stagger(100, [scaleAnimation, opacityAnimation]).start(() => {
    scaleValue.setValue(0);
    opacityValue.setValue(maxOpacity);
  });
}
