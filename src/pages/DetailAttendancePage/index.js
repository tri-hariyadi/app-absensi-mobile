import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { showMessage } from 'react-native-flash-message';
import Geocoder from 'react-native-geocoder-reborn';
import Geolocation from 'react-native-geolocation-service';
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
import { getData } from '../../store/localStorage';
import { absentIn, absentOut, resetAllReducerTransaction } from '../../store/actions/TransactionAction';

import { Gap, Header, Alert, Button } from '../../components';
import { colors, customFont } from '../../utils';
import Styles from './style';
import FingerScann from './FingerScann';
import AttendanceTag from './AttendenceTag';
import { getUserById } from '../../store/actions/CommonAction';
import { ILNullPhotoMarker } from '../../assets';
import { useMemo } from 'react';

const mapStateToProps = state => ({
  absentInLoading: state.TransactionReducer.absentInLoading,
  absentInData: state.TransactionReducer.absentInData,
  absentInError: state.TransactionReducer.absentInError,

  absentOutLoading: state.TransactionReducer.absentOutLoading,
  absentOutData: state.TransactionReducer.absentOutData,
  absentOutError: state.TransactionReducer.absentOutError,

  getUserByIdData: state.CommonReducer.getUserByIdData,
});

const DetailAttendancePage = ({
  route,
  navigation,
  absentIn,
  absentOut,
  resetAllReducerTransaction,
  absentInData,
  absentInError,
  absentOutData,
  absentOutError,
  getUserByIdData
}) => {
  let timer;
  let counter = 0;
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertErrorIn, setShowAlertErrorIn] = useState(false);
  const [biometryType, setBiometryType] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessageLegacy, setErrorMessageLegacy] = useState(false);
  const [alertFingerScann, setAlertFingerScann] = useState(false);
  const [tagAttendance, setTagAttendance] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [photoUser, setPhotoUser] = useState(ILNullPhotoMarker);
  const data = route.params;
  const dataImage = route.params.dataImage;
  const dataAbsent = route.params.dataAbsent;
  const ActionType = route.params.actionType;
  const a = useRef();

  const getToken = () => new Promise(async (resolve, reject) => {
    if (!tagAttendance && !tagAttendance.value) reject('Failed, please select the attendance tag');
    if (!data && ActionType === 'absentIn') reject('Failed, no image in');
    if (!(dataImage && dataAbsent) && ActionType === 'absentOut') reject('Failed, the required data does not exist');
    if (!position) reject('Failed, no location detected, please turn on your location');
    const token = await getData('token');
    if (token) resolve(jwt_decode(token.accessToken));
  });

  const getPosstion = () => {
    Geolocation.getCurrentPosition(
      position => {
        const POSITION = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setPosition(POSITION);
        Geocoder.geocodePosition(POSITION).then(res => {
          setAddress(res[0].formattedAddress);
          counter = 0;
        }).catch(err => {
          setAddress(err.message);
          showMessage({
            message: err.message,
            type: 'danger'
          });
          counter++;
          timer = setTimeout(() => getLocation(), 3000)
          if (counter > 2) clearTimeout(timer)
        });
      },

      error => {
        setAddress(error.message);
        showMessage({
          message: error.message,
          type: 'danger',
        });
        counter++;
        timer = setTimeout(() => getLocation(), 3000)
        if (counter > 2) clearTimeout(timer)
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 3600000 }
    );
  }

  const getLocation = async () => {
    if (Platform.OS === 'ios') {
      setAddress('Loading...');
      await Geolocation.requestAuthorization("whenInUse");
      getPosstion();
    }

    if (Platform.OS === 'android') {
      setAddress('Loading...');
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      getPosstion();
    }
  }

  const checkBiometryType = () => {
    FingerprintScanner
      .isSensorAvailable()
      .then(biometryType => setBiometryType(biometryType))
      .catch(() => setBiometryType(false));
  }

  const requiresLegacyAuthentication = () => {
    return Platform.Version < 23;
  }

  const authLegacy = () => {
    setAlertFingerScann(true);
    FingerprintScanner
      .authenticate({ onAttempt: handleAuthenticationAttemptedLegacy() })
      .then(() => {
        setAlertFingerScann(false);
        onSubmit();
      })
      .catch((error) => {
        setErrorMessageLegacy(error.message);
      });
  }

  const handleAuthenticationAttemptedLegacy = (error) => {
    setErrorMessageLegacy('error.message');
  };

  const authCurrent = () => {
    FingerprintScanner
      .authenticate({ title: 'Fingerprint Authentication' })
      .then(() => {
        console.log('BRAINS');
        onSubmit();
      });
  }

  const onTakePressed = () => {
    FingerprintScanner.release();
    if (biometryType) {
      if (requiresLegacyAuthentication()) authLegacy();
      else authCurrent();
    } else {
      onSubmit();
    }
  }

  const onSubmit = () => {
    console.log('SUBMIT');
    setLoadingSubmit(true);
    getToken().then(res => {
      if (data && !dataAbsent) absentIn(
        res.idUser, res.username, tagAttendance.label, address, data.data);
      if (dataImage && dataAbsent) absentOut(dataAbsent._id, address, dataImage);
    }).catch(err => {
      setLoadingSubmit(false);
      showMessage({
        message: err,
        type: 'danger',
      });
    });
  }

  const getUserPhoto = async () => {
    const payload = await getData('token');
    if (!getUserByIdData) getUserById({ id: jwt_decode(payload.accessToken).idUser });
  }

  useEffect(() => {
    if (absentInData || absentOutData) setLoadingSubmit(false);
    if (absentInError || absentOutError) setLoadingSubmit(false);
  }, [absentInData, absentOutData, absentInError, absentOutError]);

  useEffect(() => {
    getLocation();
    checkBiometryType();

    return () => {
      FingerprintScanner.release();
      setTagAttendance('');
      clearTimeout(timer);
      resetAllReducerTransaction();
    }
  }, [counter, navigation]);

  useEffect(() => {
    getUserPhoto();
  }, []);

  useMemo(() => {
    if (getUserByIdData) setPhotoUser({ uri: getUserByIdData.image })
  }, [getUserByIdData])

  useEffect(() => {
    if (!a.current) {
      a.current = true;
    } else {
      if (absentInData && !showModal) {
        setShowModal(true);
        setAlertTitle(`You've Checked In`);
      }
      if (absentOutData && !showModal) {
        setShowModal(true);
        setAlertTitle(`You've Checked Out`);
      }
      if (absentOutError && !showAlertError) {
        setShowAlertError(true);
        resetAllReducerTransaction();
      }
      if (absentInError && !showAlertErrorIn) {
        setShowAlertErrorIn(true);
        resetAllReducerTransaction();
      }

      // console.log('dataAbsent => ', dataAbsent);
      if (dataAbsent && dataAbsent.desc && !tagAttendance)
        setTagAttendance({ label: dataAbsent.desc });
    }

  });

  return (
    <>
      <SafeAreaView style={Styles.container}>
        <StatusBar
          backgroundColor={colors.colorVariables.indigo1}
          barStyle={Platform.OS === 'ios' ? "light-content" : "light-content"}
        />
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1 }}>
            <Header
              title="Attendance Detail"
              background={colors.colorVariables.indigo1}
              onPress={() => navigation.goBack()}
            />
            <Gap height={3} />
            <View style={Styles.content}>
              <Text style={Styles.textSection}>Location</Text>
              <Gap height={1} />
              <View style={Styles.detailLocation}>
                <Icon
                  name="location-on"
                  size={responsiveFontSize(2.6)}
                  color={colors.colorVariables.danger}
                />
                <Text style={Styles.textAddress}>{address}</Text>
              </View>
            </View>
            <Gap height={3} />
            <View style={Styles.content}>
              <Text style={Styles.textSection}>Tag/project</Text>
              <Gap height={1} />
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={Styles.detailLocation}>
                <Icon
                  name="cases"
                  size={responsiveFontSize(2.6)}
                  color={colors.colorVariables.danger}
                />
                <Text style={Styles.textAddress}>{tagAttendance ? tagAttendance.label : 'Select Attendance Tag or project'}</Text>
              </TouchableOpacity>
            </View>
            <Gap height={2} />
            <View style={Styles.wrapperMap}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={Styles.map}
                region={{
                  latitude: position.lat ? position.lat : 0,
                  longitude: position.lng ? position.lng : 0,
                  latitudeDelta: 0.0,
                  longitudeDelta: 0.0144,
                }}
                borderRadius={10}
              >
                <Marker
                  // icon={require('../../assets/Illustration/null-photo.png')}
                  // image={require('../../assets/Illustration/null-photo.png')}
                  coordinate={{
                    latitude: position.lat ? position.lat : 0,
                    longitude: position.lng ? position.lng : 0
                  }}>
                  <View>
                    <Icon
                      name="location-on"
                      size={responsiveFontSize(8)}
                      color={colors.colorVariables.danger}
                    />
                    <Image
                      source={photoUser}
                      onError={() => setPhotoUser(ILNullPhotoMarker)}
                      style={{
                        height: 35,
                        width: 35,
                        position: 'absolute',
                        left: 17,
                        right: 0,
                        top: 8.5,
                        resizeMode: 'cover',
                        borderRadius: 35 / 2
                      }} />
                  </View>
                </Marker>
              </MapView>
            </View>
          </View>
          <View>
            <View style={Styles.btnCaptureWrapper}>
              <View style={Styles.btnTakeWrapper}>
                <Button
                  BtnIcon
                  large={2.2}
                  iconName="fingerprint"
                  type='danger'
                  containerBtnIconStyle={Styles.containerBtnIconStyle}
                  onPress={onTakePressed}
                />
              </View>
              <Gap height={1} />
              <Text style={Styles.textCapture}>Checked In</Text>
            </View>
            <View style={Styles.btnCaptureContainer}>
              <View style={Styles.bottomMenuWrapper}>
                <TouchableOpacity
                  style={Styles.btnRetake}
                  onPress={() => navigation.goBack()}>
                  <Icon
                    name="autorenew"
                    size={responsiveFontSize(4.5)}
                    color={colors.colorVariables.white}
                  />
                  <Text style={Styles.textCapture}>Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
      {showModal && <Alert
        show={showModal}
        type='success'
        title={alertTitle}
        message='Thank you and have a nice day'
        showConfirmButton={true}
        confirmText='OK'
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        onConfirmPressed={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainApp' }]
            })
          );
          setShowModal(false);
        }}
        onDismiss={() => setShowModal(false)}
      />}
      {modalVisible &&
        <AttendanceTag
          modalShow={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          dismiss={() => setModalVisible(false)}
          onDismiss={(attendacetag) => setTagAttendance(attendacetag)}
        />
      }
      {requiresLegacyAuthentication() &&
        <FingerScann
          showAlert={alertFingerScann}
          errorMessageLegacy={errorMessageLegacy}
          onCancelPress={() => setAlertFingerScann(false)}
        />
      }
      {showAlertError && <Alert
        show={showAlertError}
        type='error'
        title='Error'
        message='Failed checked out, make sure your internet connection is stable'
        showCancelButton
        cancelText='OK'
        onCancelPressed={() => setShowAlertError(false)}
        onDismiss={() => setShowAlertError(false)}
      />}
      {showAlertErrorIn && <Alert
        show={showAlertErrorIn}
        type='error'
        title='Error'
        message='Failed checked In, please try again'
        showCancelButton
        cancelText='OK'
        onCancelPressed={() => setShowAlertErrorIn(false)}
        onDismiss={() => setShowAlertErrorIn(false)}
      />}
      {loadingSubmit && <Alert
        show={loadingSubmit}
        showProgress
        progressSize={35}
        progressColor={colors.colorVariables.blueDark}
        customView={<Text style={{ fontFamily: customFont.secondary[600] }}>Loading...</Text>}
        closeOnHardwareBackPress={false}
        closeOnTouchOutside={false}
      />}
    </>
  )
}

export default connect(mapStateToProps, { absentIn, absentOut, resetAllReducerTransaction })(DetailAttendancePage);
