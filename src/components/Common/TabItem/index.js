import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Animated, Easing, TouchableWithoutFeedback, Alert } from 'react-native';
import { connect } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { styles } from './style';
import { colors, RippleAnimation } from '../../../utils';
import messaging from '@react-native-firebase/messaging';
import SQLiteData from '../../../store/SQLiteData';

const TabItem = ({ title, active, onPress, onLongPress, dataNotification }) => {
  const maxOpacity = 0.5;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(maxOpacity)).current;
  const animatedColor = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [icon, setIcon] = useState(false);
  const [notif, setNotif] = useState({ show: false, item: 0 });

  useEffect(() => {
    if (dataNotification) {
      let a = dataNotification.filter(v => v.status_read === 0);
      if (a.length > 0) setNotif({
        show: true,
        item: a.length
      });
      else setNotif({ show: false, item: 0 })
    }
  }, [dataNotification]);

  const YAnimation = Animated.timing(animatedY, {
    toValue: 1,
    easing: Easing.ease,
    useNativeDriver: false,
  });

  const colorAnimation = Animated.timing(animatedColor, {
    toValue: 1,
    useNativeDriver: false,
  });

  const animatedIcon = () => {
    animatedColor.setValue(0);
    animatedY.setValue(0);
    Animated.stagger(0, [YAnimation, colorAnimation]).start();
  }

  let labelStyle = {
    transform: [{
      translateY: animatedY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 4]
      })
    }],
    color: animatedColor.interpolate({
      inputRange: [0, 1],
      outputRange: [
        colors.colorVariables.black3, active ? colors.colorVariables.purple2 : colors.colorVariables.black3
      ],
    }),
    position: 'relative',
  }

  const onTabPressed = () => {
    if (onPress) onPress();
    if (!active) {
      RippleAnimation(scaleValue, opacityValue, maxOpacity);
      animatedIcon();
    }
  }

  React.useMemo(() => {
    if (!active.current) {
      setTimeout(() => setIcon(active), active ? 350 : 0);
    }
  }, [active]);

  useEffect(() => {
    Animated.timing(animatedColor, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false
    }).start();
  }, [])

  const IconTabMenu = () => {
    switch (title) {
      case 'Home':
        return (
          <Animated.Text style={labelStyle}>
            <MaterialCommunityIcons
              name={icon ? 'home' : 'home-outline'}
              size={responsiveFontSize(2.8)}
            />
          </Animated.Text>
        )
      case 'Reimbursement':
        return (
          <Animated.Text style={labelStyle}>
            <MaterialCommunityIcons
              name={icon ? 'script-text' : 'script-text-outline'}
              size={responsiveFontSize(2.8)}
            />
          </Animated.Text>
        )
      case 'Profile':
        return (
          <View>
            <Animated.Text style={labelStyle}>
              <MaterialCommunityIcons
                name={icon ? 'account' : 'account-outline'}
                size={responsiveFontSize(2.8)}
              />
            </Animated.Text>
            {notif.show && <View style={styles.badge}>
              <Text style={styles.badgeItem}>{notif.item}</Text>
            </View>}
          </View>
        )
      default:
        return null;
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={onTabPressed}
      onLongPress={onLongPress}
    >
      <View
        onLayout={event => {
          setWidth(event.nativeEvent.layout.width);
          setHeight(event.nativeEvent.layout.height);
        }}
        style={styles.container(width)}>
        <Animated.View
          style={styles.animatedView(scaleValue, opacityValue, width - 2, height)}
        />
        <IconTabMenu />
        <Text style={styles.text(active)}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const mapStateToProps = state => ({
  dataNotification: state.NotificationReducer.dataNotification
})

export default connect(mapStateToProps)(TabItem);
