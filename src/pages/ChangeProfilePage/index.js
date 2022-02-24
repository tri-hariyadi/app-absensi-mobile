import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Header,
  Gap,
  TextField,
  DatePickerField,
  Button,
  SelectField,
  LoadingScreen,
  Alert
} from '../../components';
import { useIsFocused } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { CommonActions } from '@react-navigation/native';
import { Field, reduxForm, autofill } from 'redux-form';
import { connect } from 'react-redux';
import { colors, customFont, dateFormat } from '../../utils';
import { ProfileValidation } from '../../config/validation';
import { updateProfile, resetAllReducerTransaction } from '../../store/actions/TransactionAction';
import { getUserById, resetAllCommonReducer } from '../../store/actions/CommonAction';
import { resetAllAuthReducer } from '../../store/actions/AuthAction';
import { userLogout } from '../../store/actions/AuthAction';
import { getData, removeData } from '../../store/localStorage';
import jwt_decode from 'jwt-decode';

const mapStateToProps = state => ({
  updateProfileLoading: state.TransactionReducer.updateProfileLoading,
  updateProfileData: state.TransactionReducer.updateProfileData,
  updateProfileError: state.TransactionReducer.updateProfileError,
  getUserByIdLoading: state.CommonReducer.getUserByIdLoading,
  getUserByIdData: state.CommonReducer.getUserByIdData,
  getUserByIdError: state.CommonReducer.getUserByIdError,
});

const ChangeProfilePage = ({
  navigation,
  handleSubmit,
  updateProfileLoading,
  updateProfileData,
  updateProfileError,
  getUserByIdData,
  getUserByIdError,
  getUserById,
  updateProfile,
  resetAllReducerTransaction,
  resetAllCommonReducer,
  autofill,
  userLogout,
  resetAllAuthReducer,
  token
}) => {
  const a = useRef();
  const b = useRef();
  const c = useRef();
  const d = useRef();
  const e = useRef();
  const g = useRef();
  const j = useRef();
  const k = useRef();
  const l = useRef();
  const m = useRef();
  const scrollViewRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [dataUser, setDataUser] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getDataUser = async () => {
      setLoadingPage(true);
      const token = await getData('token');
      let decoded;
      if (token) {
        decoded = jwt_decode(token.accessToken);
        setDataUser(decoded);
      }
      getUserById({ id: decoded.idUser });
    }
    const unsubscribe = navigation.addListener('focus', async () => {
      getDataUser();
    });
    return () => {
      unsubscribe();
      resetAllReducerTransaction();
      resetAllCommonReducer();
    }
  }, []);

  useEffect(() => {
    if (getUserByIdData && isFocused) {
      const ObjFields = {
        username: getUserByIdData.username,
        email: getUserByIdData.email,
        phonenumber: getUserByIdData.phonenumber,
        organisation: getUserByIdData.organisation,
        divisi: getUserByIdData.divisi,
        nik: getUserByIdData.nik,
        dateOfBirth: dateFormat(getUserByIdData.birthDate, 'DD MMMM YYYY'),
        placeOfBirth: getUserByIdData.birthPlace,
        gender: getUserByIdData.gender,
        address: getUserByIdData.address,
        accountNumber: getUserByIdData.accountNumber,
        accountName: getUserByIdData.accountName,
        role: '0',
      }
      Object.keys(ObjFields).forEach(field => autofill('formChangeProfile', field, ObjFields[field]));
    } else if (getUserByIdError && isFocused) {
      showMessage({
        message:
          `Failed get data profile, can't connect to the server`,
        type: 'danger',
        duration: 2600
      });
    }
    setLoadingPage(false);
  }, [getUserByIdData, getUserByIdError]);

  useEffect(() => {
    if (updateProfileData) {
      resetAllAuthReducer();
      setShowAlert({
        show: true,
        type: 'success',
        title: 'Success',
        message: 'Request is send, please wait until admin accept your change request.'
      });
    }
    else if (updateProfileError) setShowAlert({
      show: true,
      type: 'error',
      title: 'Error',
      message: `Request Update profile failed because ${updateProfileError}`
    });
  }, [updateProfileData, updateProfileError]);

  const onFocusDateBirth = () => {
    Keyboard.dismiss();
    setShowModal(true);
  }

  const onSubmit = data => {
    let date_birth = data.dateOfBirth.split('-');
    let dataUpdate = {
      userId: dataUser.idUser,
      username: data.username,
      email: data.email,
      phonenumber: data.phonenumber,
      organisation: data.organisation,
      divisi: data.divisi,
      nik: data.nik,
      birthDate: data.dateOfBirth.split('-')[0].length > 2 ? new Date(data.dateOfBirth) : new Date(`${date_birth[2]}-${date_birth[1]}-${date_birth[0]}`),
      birthPlace: data.placeOfBirth,
      gender: data.gender,
      address: data.address,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      role: '0',
    }
    if (data.password) dataUpdate['password'] = data.password;
    updateProfile(dataUpdate);
  }

  const toLoginPage = async () => {
    const promise = await removeData('token');
    await Promise.resolve(promise);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginPage' }]
      })
    );
  }

  return (
    <SafeAreaView style={Styles.container}>
      <Header
        title="Change Profile"
        background={colors.colorVariables.purple1}
        onPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}>

        <View style={Styles.content}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}>
            <Gap height={3} />
            <Field
              autoFillField
              externalRef={a}
              name='username'
              iconName='person'
              component={TextField}
              returnKeyType='next'
              blurOnSubmit={false}
              label='Full Name'
              autoCapitalize='words'
              onSubmitEditing={() => b.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={b}
              name='email'
              iconName='email'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='next'
              label='Email'
              keyboardType='email-address'
              onSubmitEditing={() => c.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={c}
              name='phonenumber'
              iconName='phone-android'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='next'
              label='Phone Number'
              keyboardType='numeric'
              maxLength={12}
              onSubmitEditing={() => d.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={d}
              name='organisation'
              iconName='corporate-fare'
              component={TextField}
              returnKeyType='next'
              label='Organization'
              autoCapitalize='words'
              onSubmitEditing={() => e.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={e}
              name='divisi'
              iconName='group'
              component={TextField}
              returnKeyType='next'
              label='Division'
              autoCapitalize='words'
              onSubmitEditing={() => g.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={g}
              name='nik'
              iconName='confirmation-number'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='next'
              label='NIK'
              keyboardType='numeric'
              onSubmitEditing={() => l.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={l}
              multiline
              name='address'
              iconName='home'
              autoCapitalize='words'
              component={TextField}
              returnKeyType='next'
              label='Address'
              onSubmitEditing={() => j.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={j}
              name='placeOfBirth'
              iconName='location-on'
              component={TextField}
              returnKeyType='next'
              label='Place Of Birth'
              autoCapitalize='sentences'
              onSubmitEditing={() => k.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={k}
              name='dateOfBirth'
              iconName='event'
              component={TextField}
              returnKeyType='next'
              label='Date Of Birth'
              onFocusTextField={onFocusDateBirth}
              showSoftInputOnFocus
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              name='gender'
              iconName='emoji-people'
              options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
              component={SelectField}
              isLoading={false}
              label='Gender'
              dropdownStyle={{ left: 13, width: '90%', position: 'relative' }}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              name='accountNumber'
              iconName='account-balance'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='next'
              label='Account Number'
              autoCapitalize='words'
              onSubmitEditing={() => m.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              autoFillField
              externalRef={m}
              name='accountName'
              iconName='badge'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='done'
              label='Account Name'
              autoCapitalize='words'
            />
            <Gap height={5} />
            <Button
              background={colors.colorVariables.purple1}
              type="primary"
              borderRadius={12}
              onPress={handleSubmit(onSubmit)}>
              Submit
            </Button>
            <Gap height={5} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}>
        <View style={Styles.modalContainer} >
          <View style={Styles.modalContent}>
            <Text style={Styles.modalTitle}>Enter Your Birth Date</Text>
            <Gap height={1} />
            <DatePickerField form='formChangeProfile' name="dateOfBirth" />
            <Gap height={2} />
            <View>
              <Gap width={1} />
              <TouchableOpacity
                style={[Styles.modalButton, { backgroundColor: colors.colorVariables.blue1 }]}
                onPress={() => setShowModal(false)}>
                <Text style={Styles.modalTextButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <LoadingScreen show={loadingPage} />
      {showAlert &&
        <Alert
          show={showAlert.show}
          type={showAlert.type}
          title={showAlert.title}
          message={showAlert.message}
          showConfirmButton
          confirmText="OK"
          onConfirmPressed={() => {
            setShowAlert(false);
            navigation.goBack();
          }}
        />
      }
      {updateProfileLoading &&
        <Alert
          show={updateProfileLoading}
          showProgress
          progressSize={35}
          progressColor={colors.colorVariables.blueDark}
          customView={<Text style={{ fontFamily: customFont.secondary[600] }}>Loading...</Text>}
          closeOnHardwareBackPress={false}
          closeOnTouchOutside={false}
        />
      }
    </SafeAreaView>
  )
}

export default reduxForm({
  form: 'formChangeProfile',
  validate: ProfileValidation
})(connect(mapStateToProps, {
  getUserById,
  updateProfile,
  autofill,
  userLogout,
  resetAllReducerTransaction,
  resetAllCommonReducer,
  resetAllAuthReducer
})(ChangeProfilePage));

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.colorVariables.white,
  },
  content: {
    marginHorizontal: responsiveWidth(6),
  },
  //ModalStyle
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.colorVariables.black4
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(8),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 6,
    width: '85%'
  },
  modalTitle: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2.3),
    textAlign: "center"
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: responsiveWidth(4),
    elevation: 2,
    backgroundColor: colors.colorVariables.redLighten1
  },
  modalTextButton: {
    textAlign: "center",
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(2)
  },
});
