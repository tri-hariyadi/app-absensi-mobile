import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity
} from 'react-native'
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Gap } from '../../Common';
import { colors, customFont } from '../../../utils';

const BottomModal = React.forwardRef(({
  children,
  childrenWrapperStyle,
  btnDone,
  btnDoneText,
  btnDoneStyle,
}, ref) => {
  const [visible, setVisible] = useState(false);
  const modalHeight = useRef(0);
  const panY = useRef(new Animated.Value(Dimensions.get('screen').height)).current;
  const resetPositionAnim = useRef(Animated.timing(panY, {
    toValue: 0, duration: 300, useNativeDriver: false
  })).current;
  const closeAnim = useRef(Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 500,
    useNativeDriver: false
  })).current;
  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([
        null, { dy: panY }
      ], { useNativeDriver: false }),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > (50 / 100) * modalHeight.current || gs.vy > 0.3) {
          return closeAnim.start(() => setVisible(v => !v));
        }
        return resetPositionAnim.start();
      },
    })
  ).current;

  useEffect(() => {
    if (visible) resetPositionAnim.start();
  }, [visible]);

  const dismissModal = () => closeAnim.start(() => setVisible(v => !v));

  if (ref) ref.current = { dismiss: dismissModal };

  return (
    <Modal
      animated
      animationType='fade'
      visible={visible}
      transparent
      onRequestClose={() => dismissModal()}>
      <View style={Styles.overlay}>
        <Animated.View {...panResponder.panHandlers} style={[Styles.ModalContainer, { top }]} onLayout={(e) => {
          modalHeight.current = e.nativeEvent.layout.height;
        }}>
          <View style={Styles.topLineModal}>
            <View style={Styles.lineModal}></View>
          </View>
          <View style={childrenWrapperStyle}>
            {children}
          </View>
          <Gap height={2} />
          {btnDone &&
            <>
              <View style={Styles.lineBottomModal} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={dismissModal}
                style={[Styles.btnDone, btnDoneStyle]}>
                <Text style={Styles.textBtnDone}>{btnDoneText || `Done`}</Text>
              </TouchableOpacity>
            </>
          }
        </Animated.View>
      </View>
    </Modal>
  )
})

export default React.memo(BottomModal);

const Styles = StyleSheet.create({
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
  btnDone: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    margin: 10,
    backgroundColor: colors.colorVariables.purple1,
    borderRadius: 10,
  },
  textBtnDone: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(2.1),
    color: colors.colorVariables.white,
  },
});
