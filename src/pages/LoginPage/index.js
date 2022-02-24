import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { ICLogoApp, ILBgLogin } from '../../assets';
import { Gap, TextField, Button, Link, Alert, BottomModal } from '../../components';
import { LoginValidation } from '../../config/validation';
import { colors } from '../../utils';
import { loginUser, resetAllAuthReducer, recoveryPassword } from '../../store/actions/AuthAction';
import { useDispatch, connect } from 'react-redux';
import Styles from './style';
import { getData } from '../../store/localStorage';

const LoginPage = props => {
  const a = useRef();
  const b = useRef();
  const scrollViewRef = useRef();
  const modalBtmRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenDecoded, setTokenDecoded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [emailRecovery, setEmailRecovery] = useState('');
  const [alertError, setAlertError] = useState({ show: false, message: '' });
  const [successRecovery, setSuccessRecovery] = useState(false);
  const [loadingRecovery, setLoadingRecovery] = useState(false);
  const keyboardShowListener = useRef(null);
  const keyboardHideListener = useRef(null);
  const animated = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener('keyboardDidShow', () =>
      setIsOpen(true),
    );
    keyboardHideListener.current = Keyboard.addListener('keyboardDidHide', () =>
      setIsOpen(false),
    );

    if (!isOpen.current) {
      Animated.timing(animated, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false
      }).start();
    }

    return () => {
      keyboardShowListener.current.remove();
      keyboardHideListener.current.remove();
      dispatch(resetAllAuthReducer());
    }
  }, [isOpen, props.token]);

  useEffect(() => {
    if (props.token || tokenDecoded) props.navigation.replace('MainApp');
    if (props.errorLogin) {
      setShowAlert({
        show: true,
        type: 'error',
        title: 'Error',
        message: `Can not login because ${props.errorLogin.toLowerCase()}`
      });
      dispatch(resetAllAuthReducer());
    }
  }, [props.token, tokenDecoded, props.errorLogin]);

  const getToken = async () => {
    const token = await getData('token');
    setTokenDecoded(token);
  }

  useEffect(() => {
    setEmailRecovery(props.hasEmailRecovery);
  }, [props.hasEmailRecovery]);

  const onSubmit = async (data) => dispatch(loginUser(data));

  const onSubmitRecovery = async (payload) => {
    if (!payload) {
      setAlertError({
        show: true,
        message: 'Email is required to recovery password.'
      });
    } else {
      setLoadingRecovery(true)
      const res = await recoveryPassword({ email: payload });
      if (res.result) {
        modalBtmRef.current.dismiss();
        setSuccessRecovery(true);
      } else {
        setAlertError({
          show: true,
          message: res.errMsg
        });
      }
      setLoadingRecovery(false)
    }
  }

  useEffect(() => {
    let timer = setTimeout(() => {
      setAlertError(v => ({ ...v, show: false }));
    }, 2600);
    return () => {
      if (!alertError.show) {
        clearTimeout(timer);
      }
    }
  }, [alertError]);

  return (
    <>
      <StatusBar backgroundColor={colors.colorVariables.bluePrimary} barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={Styles.container}
        >
          <Animated.View style={{
            opacity: animated.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
            height: animated.interpolate({
              inputRange: [0, 1],
              outputRange: ["40%", "0%"],
            }),
            display: isOpen ? 'none' : 'flex'
          }}>
            <ImageBackground
              source={ILBgLogin}
              style={Styles.heroImage}
              imageStyle={Styles.backgroundImageStyle}>
              <Image source={ICLogoApp} style={Styles.imageLogo2} />
              <Gap height={2} />
              <Text style={Styles.textWelcome}>Welcome</Text>
              <Text style={Styles.textDesc}>Sign in to continue</Text>
            </ImageBackground>
          </Animated.View>
          <View style={Styles.content(isOpen)}>
            <View style={Styles.logoWrapper}>
              <Animated.View
                style={{
                  opacity: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                  height: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, responsiveHeight(20)],
                  }),
                  display: isOpen ? 'flex' : 'none'
                }}>
                <Image source={ICLogoApp} style={Styles.imageLogo} />
              </Animated.View>
            </View>
            <View>
              <Field
                externalRef={a}
                name='email'
                iconName='email'
                autoCapitalize='none'
                component={TextField}
                returnKeyType='next'
                blurOnSubmit={false}
                label='Email'
                onSubmitEditing={() => b.current.focus()}
              />
              <Gap height={1.5} />
              <Field
                externalRef={b}
                name='password'
                floatingLabel
                iconName='vpn-key'
                autoCapitalize='none'
                component={TextField}
                label='Password'
                secureTextEntry
              />
              <Gap height={4} />
              <Button
                type="primary"
                borderRadius={15}
                isLoading={props.loading}
                onPress={props.handleSubmit(onSubmit)}
              >
                Sign in
              </Button>
              <Link
                desc='Forgot Password?'
                link='Recover Here'
                onPress={() => modalBtmRef.current.dismiss()}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Alert
        show={showAlert.show}
        type={showAlert.type}
        title={showAlert.title}
        message={showAlert.message}
        showConfirmButton={true}
        confirmText="OK"
        onConfirmPressed={() => setShowAlert(false)}
        onDismiss={() => setShowAlert(false)}
      />
      {successRecovery && <Alert
        show={successRecovery}
        type='success'
        title='Success'
        message='Recovery password successfully, please check your email to get new password.'
        showConfirmButton={true}
        confirmText="OK"
        onConfirmPressed={() => setSuccessRecovery(false)}
        onDismiss={() => setSuccessRecovery(false)}
      />}
      <BottomModal
        ref={modalBtmRef}
        btnDoneText='Cancel'>
        <View style={Styles.modalBtmWrapper}>
          <Text style={Styles.textRecovery}>Enter your email for password recovery.</Text>
          <Gap height={2.5} />
          <Field
            name='emailRecovery'
            iconName='email'
            autoCapitalize='none'
            component={TextField}
            label='Email'
          />
          <Gap height={3} />
          <View style={Styles.btnModalWrapper}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => onSubmitRecovery(emailRecovery)}
              style={[Styles.btnSubmitRecovery, loadingRecovery ? { backgroundColor: '#5A5BA7' } : {}]}>
              {loadingRecovery ?
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <ActivityIndicator size={18} color={colors.colorVariables.white} />
                  <Gap width={1.5} />
                  <Text style={Styles.textbtnSubmitRecovery}>Loading...</Text>
                </View>
                :
                <Text style={Styles.textbtnSubmitRecovery}>Submit</Text>
              }
            </TouchableOpacity>
            <Gap width={3} />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => modalBtmRef.current.dismiss()}
              style={[Styles.btnSubmitRecovery, { backgroundColor: colors.colorVariables.danger }]}>
              <Text style={Styles.textbtnSubmitRecovery}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>
      <Modal
        animationType='slide'
        visible={alertError.show}
        transparent
        onRequestClose={() => setAlertError(v => ({ ...v, show: false }))}>
        <TouchableWithoutFeedback
          accessible={false}
          disabled={!alertError.show}
          onPress={() => setAlertError(v => ({ ...v, show: false }))}>
          <View style={{ flex: 1 }}>
            <View style={Styles.toastWrapper}>
              <View style={Styles.toastShadow}>
                <View style={Styles.toastBox}>
                  <Text style={Styles.toastText}>{alertError.message}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

const selector = formValueSelector('formLogin');
const mapStateToProps = state => ({
  loading: state.AuthReducer.loading,
  token: state.AuthReducer.token,
  errorLogin: state.AuthReducer.errorLogin,
  hasEmailRecovery: selector(state, 'emailRecovery')
});

export default reduxForm({
  form: 'formLogin',
  validate: LoginValidation,
  enableReinitialize: true,
  initialValues: {
    email: 'p130420027@bussan.co.id',
    password: 'Dewitri1996'
  }
})(connect(mapStateToProps, null)(LoginPage));
