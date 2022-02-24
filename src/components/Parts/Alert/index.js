import React, { Component } from 'react';
import {
  Text,
  Animated,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  BackAndroid,
  BackHandler,
  Modal,
  Platform,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Styles from './style';
import { ILCheckMark, ILErrorMark, ILWarningMark } from '../../../assets';
import { Gap } from '../../Common';

const HwBackHandler = BackHandler || BackAndroid;
const HW_BACK_EVENT = 'hardwareBackPress';

const { OS } = Platform;

export default class Alert extends Component {
  constructor(props) {
    super(props);
    const { show } = this.props;
    this.springValue = new Animated.Value(0.3);

    this.state = {
      showSelf: false,
    };

    if (show) this._springShow(true);
  }

  componentDidMount() {
    HwBackHandler.addEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }

  _springShow = (fromConstructor) => {
    const { useNativeDriver = false } = this.props;

    this._toggleAlert(fromConstructor);
    this.springValue.setValue(0.3)
    Animated.spring(this.springValue, {
      toValue: 1.2,
      friction: 5,
      tension: 150,
      useNativeDriver,
    }).start();
  };

  _springHide = () => {
    const { useNativeDriver = false } = this.props;

    if (this.state.showSelf === true) {
      Animated.spring(this.springValue, {
        toValue: 0,
        tension: 10,
        useNativeDriver,
      }).start();

      setTimeout(() => {
        this._toggleAlert();
        this._onDismiss();
      }, 70);
    }
  };

  _toggleAlert = (fromConstructor) => {
    if (fromConstructor) this.state = { showSelf: true };
    else this.setState({ showSelf: !this.state.showSelf });
  };

  _handleHwBackEvent = () => {
    const { closeOnHardwareBackPress } = this.props;
    if (this.state.showSelf && closeOnHardwareBackPress) {
      this._springHide();
      return true;
    } else if (!closeOnHardwareBackPress && this.state.showSelf) {
      return true;
    }

    return false;
  };

  _onTapOutside = () => {
    const { closeOnTouchOutside } = this.props;
    if (closeOnTouchOutside) this._springHide();
  };

  _onDismiss = () => {
    const { onDismiss } = this.props;
    onDismiss && onDismiss();
  };

  _renderButton = (data) => {
    const {
      text,
      backgroundColor,
      buttonStyle,
      buttonTextStyle,
      onPress,
    } = data;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[Styles.button, { backgroundColor }, buttonStyle]}>
          <Text style={[Styles.buttonText, buttonTextStyle]}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderAlert = () => {
    const animation = {
      transform: [{
        scale: this.springValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.5, 1]
        })
      }]
    };

    const { showProgress } = this.props;
    const { title, message, customView = null } = this.props;

    const {
      showCancelButton,
      cancelText,
      cancelButtonColor,
      cancelButtonStyle,
      cancelButtonTextStyle,
      onCancelPressed,
    } = this.props;
    const {
      showConfirmButton,
      confirmText,
      confirmButtonColor,
      confirmButtonStyle,
      confirmButtonTextStyle,
      onConfirmPressed,
    } = this.props;

    const {
      alertContainerStyle,
      overlayStyle,
      progressSize,
      progressColor,
      contentContainerStyle,
      contentStyle,
      titleStyle,
      messageStyle,
      actionContainerStyle,
    } = this.props;

    const { type } = this.props;

    const cancelButtonData = {
      text: cancelText,
      backgroundColor: cancelButtonColor,
      buttonStyle: cancelButtonStyle,
      buttonTextStyle: cancelButtonTextStyle,
      onPress: onCancelPressed,
    };

    const confirmButtonData = {
      text: confirmText,
      backgroundColor: confirmButtonColor,
      buttonStyle: confirmButtonStyle,
      buttonTextStyle: confirmButtonTextStyle,
      onPress: onConfirmPressed,
    };

    return (
      <View style={[Styles.container, alertContainerStyle]}>
        <TouchableWithoutFeedback onPress={this._onTapOutside}>
          <View style={[Styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[Styles.contentContainer, animation, contentContainerStyle]}
        >
          <View style={[Styles.content, contentStyle]}>
            {!showProgress &&
              <Image source={
                type === 'success'
                  ?
                  ILCheckMark
                  :
                  type === 'warning'
                    ?
                    ILWarningMark
                    :
                    ILErrorMark} style={Styles.imageProfile(type)} />
            }
            {showProgress ? (
              <ActivityIndicator size={progressSize} color={progressColor} />
            ) : null}
            {title ? (
              <Text style={[Styles.title, titleStyle]}>{title}</Text>
            ) : null}
            {message ? (
              <Text style={[Styles.message, messageStyle]}>{message}</Text>
            ) : null}
            <Gap height={1.5} />
            {customView}
          </View>
          <View style={[Styles.action, actionContainerStyle]}>
            {showCancelButton ? this._renderButton(cancelButtonData) : null}
            {showConfirmButton ? this._renderButton(confirmButtonData) : null}
          </View>
        </Animated.View>
      </View>
    );
  };

  render() {
    const { show, showSelf } = this.state;
    const { modalProps = {}, closeOnHardwareBackPress } = this.props;

    const wrapInModal = OS === 'android' || OS === 'ios';

    return showSelf ?
      wrapInModal ? (
        <Modal
          animationType="none"
          transparent={true}
          visible={show}
          onRequestClose={() => {
            if (showSelf && closeOnHardwareBackPress) {
              this._springHide();
            }
          }}
          {...modalProps}
        >
          {this._renderAlert()}
        </Modal>
      ) : this._renderAlert()
      : null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { show } = nextProps;
    const { showSelf } = this.state;

    if (show && !showSelf) this._springShow();
    else if (show === false && showSelf) this._springHide();
  }

  componentWillUnmount() {
    HwBackHandler.removeEventListener(HW_BACK_EVENT, this._handleHwBackEvent);
  }
}

Alert.propTypes = {
  show: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
  showProgress: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  closeOnTouchOutside: PropTypes.bool,
  closeOnHardwareBackPress: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  cancelButtonColor: PropTypes.string,
  confirmButtonColor: PropTypes.string,
  onCancelPressed: PropTypes.func,
  onConfirmPressed: PropTypes.func,
  customView: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.func,
  ]),
  modalProps: PropTypes.object,
  type: PropTypes.oneOf(['success', 'warning', 'error'])
};

Alert.defaultProps = {
  show: false,
  useNativeDriver: false,
  showProgress: false,
  closeOnTouchOutside: true,
  closeOnHardwareBackPress: true,
  showCancelButton: false,
  showConfirmButton: false,
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelButtonColor: '#df0000',
  confirmButtonColor: '#4b61da',
  customView: null,
  modalProps: {},
};