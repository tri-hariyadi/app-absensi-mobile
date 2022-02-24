import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { colors } from '../../utils';
import Styles from './style';
import { Gap } from '../../components';

const FingerScann = props => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [errorScanner, setErrorScanner] = useState(false);

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  }

  React.useMemo(() => {
    setErrorScanner(props.errorMessageLegacy);
    startShake();
  }, [props.errorMessageLegacy]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.showAlert}
        style={{ backgroundColor: colors.colorVariables.black2 }}
      >
        <View style={Styles.modalContainer} >
          <View style={[Styles.modalContent, { paddingVertical: responsiveHeight(3) }]}>
            <Icon
              name="fingerprint"
              size={responsiveFontSize(10)}
              color={colors.colorVariables.bluePrimary}
            />
            <Gap height={2} />
            <Text style={[Styles.modalTitle, { lineHeight: 27 }]}>Fingerprint{'\n'}Authentication</Text>
            <Gap height={2} />
            <Animated.Text
              style={[
                Styles.textErrorFingerScann(errorScanner),
                { transform: [{ translateX: shakeAnimation }] }
              ]}>
              {errorScanner || 'Scan your fingerprint on the device scanner to continue'}
            </Animated.Text>
            <Gap height={3} />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={[Styles.modalButton, { backgroundColor: colors.colorVariables.blue1 }]}
                onPress={() => {
                  props.onCancelPress();
                  setErrorScanner(false);
                }}
              >
                <Text style={Styles.modalTextButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default FingerScann;
