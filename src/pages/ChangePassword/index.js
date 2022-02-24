import React, { useEffect, useRef, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, ScrollView, Animated } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Header, Gap, TextField, Button, Alert } from '../../components';
import { colors, customFont } from '../../utils';
import { userLogout, recoveryPassword } from '../../store/actions/AuthAction';
import { removeData, getData } from '../../store/localStorage';
import { ChangePasswordValidation } from '../../config/validation';

const ChangePassword = ({
  navigation,
  hasNewPass,
  handleSubmit,
  submitting
}) => {
  const a = useRef();
  const b = useRef();
  const c = useRef();
  const counter = useRef(new Animated.Value(0)).current;
  const tokenDecoded = useRef();
  const [count, setCount] = useState(0);
  const [showAlert, setShowAlert] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [textColor, setTextColor] = useState({
    t1: colors.colorVariables.danger,
    t2: colors.colorVariables.danger,
    t3: colors.colorVariables.danger,
    i1: 'highlight-off',
    i2: 'highlight-off',
    i3: 'highlight-off',
  });

  useEffect(() => {
    setCount(1);
    getDataUser();
  }, []);

  useEffect(() => {
    load(count);
    if (count > 100) setCount(100);
  }, [count]);

  const analyzeString = (e) => {
    let Upper = 0;
    let Lower = 0;
    let Numbers = 0;
    let Symbols = 0;
    for (let i = 0; i < e.length; i++) {
      if (e[i].match(/[A-Z]/g)) Upper++;
      if (e[i].match(/[a-z]/g)) Lower++;
      if (e[i].match(/[0-9]/g)) Numbers++;
      if (e[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) Symbols++;
    }

    if (e.length >= 8)
      setTextColor(v => ({ ...v, t1: colors.colorVariables.greenLightDark1, i1: 'check-circle-outline' }));
    else setTextColor(v => ({ ...v, t1: colors.colorVariables.danger, i1: 'highlight-off' }));
    if (Upper && Lower)
      setTextColor(v => ({ ...v, t2: colors.colorVariables.greenLightDark1, i2: 'check-circle-outline' }));
    else setTextColor(v => ({ ...v, t2: colors.colorVariables.danger, i2: 'highlight-off' }));
    if (Numbers)
      setTextColor(v => ({ ...v, t3: colors.colorVariables.greenLightDark1, i3: 'check-circle-outline' }));
    else setTextColor(v => ({ ...v, t3: colors.colorVariables.danger, i3: 'highlight-off' }));

    if (e.length < 8 && Upper)
      setCount(5);
    else if (e.length < 8)
      setCount(5);
    else if (e.length === 8 && !Upper && !Numbers && !Symbols)
      setCount(30);
    else if (e.length === 8 && Upper)
      setCount(50);
    else if (e.length === 8 && Upper && Numbers)
      setCount(60);
    else if ((e.length > 8 && e.length <= 10) && Upper && Numbers)
      setCount(75);
    else if ((e.length > 10 && e.length <= 12) && Upper && Numbers && Symbols)
      setCount(85);
    else if (e.length > 12 && Upper && Numbers && Symbols)
      setCount(100);
    if (!e) setCount(1);
  }

  const renderText = (data) => {
    if (data < 30) return 'Very Weak';
    if (data >= 30 && data < 50) return 'Normal';
    if (data >= 50 && data <= 75) return 'Medium';
    if (data > 75 && data <= 85) return 'Strong';
    if (data >= 100) return 'Very Strong'
  }

  const getBackgroundColor = (data) => {
    if (data < 50) return colors.colorVariables.danger;
    if (data >= 50 && data <= 75) return colors.colorVariables.yellowDark;
    if (data > 75 && data <= 85) return '#00A5E3';
    if (data >= 100) return colors.colorVariables.greenLightDark1
  }

  const getDataUser = async () => {
    const res = await getData('token');
    if (res) tokenDecoded.current = jwt_decode(res.accessToken);
  }

  const load = (count) => {
    Animated.timing(counter, {
      toValue: count,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const width = counter.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp"
  });

  const toLoginPage = async () => {
    const promise = await removeData('token');
    await Promise.resolve(promise);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginPage' }]
      })
    );
  };

  const onSubmit = async (data) => {
    let res = await recoveryPassword({
      email: tokenDecoded.current.email,
      password: data.newPassword,
      currentPassword: data.currentPassword
    });
    if (res.result) {
      setShowAlert({
        show: true,
        type: 'success',
        title: 'Success',
        message: 'Success updating password, please login again with new password'
      });
    } else {
      setShowAlert({
        show: true,
        type: 'error',
        title: 'Error',
        message: res.errMsg
      });
    }
  }

  return (
    <SafeAreaView style={Styles.container}>
      <Header
        title='Change Password'
        background={colors.colorVariables.purple1}
        onPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={Styles.content}>
            <Gap height={4} />
            <View></View>
            <Field
              secureTextEntry
              externalRef={a}
              name='currentPassword'
              iconName='lock'
              component={TextField}
              returnKeyType='next'
              blurOnSubmit={false}
              label='Current Password'
              autoCapitalize='none'
              onSubmitEditing={() => b.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              secureTextEntry
              externalRef={b}
              name='newPassword'
              iconName='lock-open'
              component={TextField}
              returnKeyType='next'
              blurOnSubmit={false}
              label='New Password'
              autoCapitalize='none'
              onSubmitEditing={() => c.current.focus()}
              onChange={(e) => analyzeString(e)}
            />
            <Gap height={1.5} />
            <View style={Styles.progressBar}>
              <Animated.View
                style={
                  ([StyleSheet.absoluteFill],
                  {
                    backgroundColor: getBackgroundColor(count),
                    width,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderTopRightRadius: count >= 100 ? 5 : 0,
                    borderBottomRightRadius: count >= 100 ? 5 : 0
                  })
                }>
              </Animated.View>
              {hasNewPass && <Text style={[Styles.textIndicator, { left: count * 1.5 }]}>
                {renderText(count)}
              </Text>}
            </View>
            <Gap height={1.5} />
            <View>
              <View style={Styles.textParamWrapper}>
                <Icon
                  name={textColor.i1}
                  size={responsiveFontSize(2.2)}
                  color={textColor.t1}
                />
                <Text style={[Styles.textParam, { color: textColor.t1 }]}>Length must be at least 8 characters</Text>
              </View>
              <Gap height={1} />
              <View style={Styles.textParamWrapper}>
                <Icon
                  name={textColor.i2}
                  size={responsiveFontSize(2.2)}
                  color={textColor.t2}
                />
                <Text style={[Styles.textParam, { color: textColor.t2 }]}>Lowercase and uppercase</Text>
              </View>
              <Gap height={1} />
              <View style={Styles.textParamWrapper}>
                <Icon
                  name={textColor.i3}
                  size={responsiveFontSize(2.2)}
                  color={textColor.t3}
                />
                <Text style={[Styles.textParam, { color: textColor.t3 }]}>Must contain at least one number</Text>
              </View>
            </View>
            <Gap height={3} />
            <Field
              secureTextEntry
              externalRef={c}
              name='confirmNewPassword'
              iconName='lock-open'
              component={TextField}
              returnKeyType='done'
              label='Confirm New Password'
              autoCapitalize='none'
            />
            <Gap height={5} />
            <Button
              background={colors.colorVariables.purple1}
              type="primary"
              borderRadius={12}
              isLoading={submitting}
              onPress={handleSubmit(onSubmit)}>
              Submit
            </Button>
            <Gap height={8} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Alert
        show={showAlert.show}
        type={showAlert.type}
        title={showAlert.title}
        message={showAlert.message}
        showConfirmButton={showAlert.type === 'success'}
        showCancelButton={showAlert.type === 'error'}
        cancelText="OK"
        confirmText="OK"
        onCancelPressed={() => {
          setShowAlert({
            show: false,
            type: 'error',
            title: '',
            message: ''
          });
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
          if (showAlert.type === 'success') {
            userLogout();
            toLoginPage();
          }
        }}
      />
    </SafeAreaView>
  )
}

const selector = formValueSelector('formChangePassword');
const mapStateToProps = state => ({
  hasNewPass: selector(state, 'newPassword')
});

export default reduxForm({
  form: 'formChangePassword',
  validate: ChangePasswordValidation
})(connect(mapStateToProps, {
  userLogout,
})(ChangePassword));

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.colorVariables.white,
  },
  content: {
    marginHorizontal: responsiveWidth(6),
  },
  progressBar: {
    height: 18,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.colorVariables.black3,
    borderColor: colors.colorVariables.black3,
    borderRadius: 5,
  },
  textParamWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textParam: {
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.danger,
    marginLeft: 5
  },
  textIndicator: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    fontFamily: customFont.primary[400],
    color: colors.colorVariables.white,
    fontSize: 12
  }
});
