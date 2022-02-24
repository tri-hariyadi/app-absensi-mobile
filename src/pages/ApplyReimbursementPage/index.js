import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  PermissionsAndroid,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocoder from 'react-native-geocoder-reborn';
import Geolocation from 'react-native-geolocation-service';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Field, reduxForm, reset } from 'redux-form';
import { applyReimbursement } from '../../store/actions/TransactionAction';
import { Header, Gap, TextField, DatePickerField, Button, Alert } from '../../components';
import { colors, normalizePrice } from '../../utils';
import ApplyReimbursementValidation from '../../config/validation/ApplyReimburseValidation';
import { getData } from '../../store/localStorage';
import jwt_decode from 'jwt-decode';
import Styles from './style';

const ApplyReimbursementPage = ({
  navigation,
  handleSubmit,
  reset
}) => {
  const a = useRef();
  const b = useRef();
  let timer;
  let counter = 0;
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('Slogohimo');
  const [position, setPosition] = useState(false);
  const [photoUri, setPhotoUri] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showError, setShowError] = useState({ show: false, msg: false });
  const [showSuccess, setShowSuccess] = useState({ show: false, msg: false });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [tokenDecoded, setTokenDecoded] = useState(false);

  const onFocusDateBirth = () => {
    Keyboard.dismiss();
    setShowModal(true);
  }

  const getImage = () => {
    ImagePicker.launchCamera({}, (response) => {
      if (response.uri) {
        let source = { uri: response.uri }
        setImageUri(response.uri);
        setPhotoUri({ ...source });
      }
    });
  }

  const getPosstion = () => {
    Geolocation.getCurrentPosition(
      position => {
        const POSITION = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        Geocoder.geocodePosition(POSITION).then(res => {
          setAddress(res[0].formattedAddress);
          setPosition(res[0].formattedAddress);
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
      await Geolocation.requestAuthorization('whenInUse');
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

  const onSubmit = async values => {
    setSubmitLoading(true);
    if (!imageUri || !position) {
      setShowError({
        show: true,
        msg: !imageUri ? 'Proof of reimbursement must be uploaded' : 'Job Location must be defined'
      });
      setSubmitLoading(false);
    } else {
      const payload = {
        ...values,
        total: Number(values.total.replace(/[^\d]/g, '')),
        location: position,
        status: 'processing',
        userId: tokenDecoded.idUser
      }
      const result = await applyReimbursement(payload, imageUri);
      if (result) {
        reset('applyReimbursement');
        setPhotoUri(false);
        setImageUri(false);
        setShowSuccess({
          show: true,
          msg: result
        });
      } else {
        setShowError({
          show: true,
          msg: 'Reimbursement submission failed, please try again!'
        });
      }
      setSubmitLoading(false);
    }
  }

  useEffect(() => {
    getLocation();
    const getToken = async () => {
      const token = await getData('token');
      if (token) setTokenDecoded(jwt_decode(token.accessToken));
    }
    getToken();
  }, []);

  return (
    <SafeAreaView style={Styles.container}>
      <Header
        title='Apply Reimbursement'
        background={colors.colorVariables.purple1}
        onPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='none'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={Styles.content}>
            <Gap height={3} />
            <View>
              <Text style={Styles.textSection}>Location</Text>
              <Gap height={1} />
              <View style={Styles.detailLocation}>
                <Icon
                  name='location-on'
                  size={responsiveFontSize(2.6)}
                  color={colors.colorVariables.danger}
                />
                <Text style={Styles.textAddress}>{address}</Text>
              </View>
            </View>
            <Gap height={2} />
            <Field
              name='reimbursementDate'
              iconName='event'
              component={TextField}
              returnKeyType='next'
              label='Reimbursement Date'
              autoCapitalize='words'
              onFocusTextField={onFocusDateBirth}
              showSoftInputOnFocus
            />
            <Gap height={1.5} />
            <Field
              name='reimbursementName'
              iconName='receipt'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='next'
              label='Reimbursement Name'
              autoCapitalize='words'
              onSubmitEditing={() => a.current.focus()}
            />
            <Gap height={1.5} />
            <Field
              externalRef={a}
              name='desc'
              iconName='description'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='next'
              label='Description'
              multiline
              autoCapitalize='sentences'
              styleInput={{ maxHeight: 100, fontSize: 16, paddingRight: 20, textAlign: 'justify', width: '94%' }}
            />
            <Gap height={1.5} />
            <Field
              externalRef={b}
              name='total'
              iconName='payments'
              autoCapitalize='none'
              component={TextField}
              returnKeyType='done'
              label='Total Reimbursement'
              autoCapitalize='sentences'
              normalize={normalizePrice}
              keyboardType='number-pad'
            />
            <Gap height={2} />
            <View style={Styles.card}>
              <View style={Styles.cardHeader}>
                <Text style={Styles.labelUpload}>
                  Proof of Reimbursement
                </Text>
                {photoUri && <TouchableOpacity
                  disabled={!photoUri}
                  onPress={getImage}>
                  <Text style={Styles.labelChangeDocument}>
                    Change document {'>'}
                  </Text>
                </TouchableOpacity>
                }
              </View>
              <View style={{ padding: 10 }}>
                <Text style={Styles.labelDesc}>
                  *Proof of reimbursement must be still valid
                </Text>
                {!photoUri ?
                  <TouchableOpacity
                    onPress={getImage}
                    style={{ opacity: 0.6 }}>
                    <View style={Styles.itemAddPhoto}>
                      <MaterialCommunityIcons
                        name='camera-plus-outline'
                        size={responsiveFontSize(8)}
                        color={colors.colorVariables.black3}
                      />
                      <Text style={Styles.labelUploadPhoto}>Upload Photo</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  <TouchableHighlight
                    underlayColor={colors.colorVariables.whiteSmoke4}
                    onPress={() => setShowImageViewer(true)}
                    style={Styles.photoWrapper}>
                    <View>
                      <Image
                        resizeMode='cover'
                        resizeMethod='scale'
                        style={{ width: '100%', height: 200 }}
                        source={photoUri} />
                    </View>
                  </TouchableHighlight>
                }
              </View>
              <Modal
                visible={showImageViewer}
                transparent={true}>
                <View style={{ width: '100%', backgroundColor: 'black' }}>
                  <TouchableOpacity
                    onPress={() => setShowImageViewer(false)}
                    style={{
                      marginTop: 10,
                      marginLeft: 6
                    }}>
                    <MaterialCommunityIcons
                      name='close-thick'
                      size={responsiveFontSize(3)}
                      color={colors.colorVariables.white}
                    />
                  </TouchableOpacity>
                  <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={Dimensions.get('window').width}
                    imageHeight={Dimensions.get('window').height / 1.5}>
                    <Image
                      style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height / 1.5, resizeMode: 'stretch' }}
                      source={photoUri} />
                  </ImageZoom>
                </View>
              </Modal>
            </View>
            <Gap height={2} />
            <Button
              background={colors.colorVariables.purple1}
              type='primary'
              borderRadius={10}
              onPress={handleSubmit(onSubmit)}
              isLoading={submitLoading}
              iconName='send'>
              {' '}Apply
            </Button>
            <Gap height={3} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showModal}>
        <View style={Styles.modalContainer}>
          <View style={Styles.modalContent}>
            <Text style={Styles.modalTitle}>Enter Reimbursement Date</Text>
            <Gap height={1} />
            <DatePickerField form='applyReimbursement' name='reimbursementDate' />
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
      {showError.show &&
        <Alert
          show={showError.show}
          type='warning'
          title='Warning'
          message={showError.msg}
          showConfirmButton
          confirmText='OK'
          onConfirmPressed={() => setShowError({ show: false, msg: false })}
          onDismiss={() => setShowError({ show: false, msg: false })}
        />
      }
      {showSuccess.show &&
        <Alert
          show={showSuccess.show}
          type='success'
          title='Success'
          message={showSuccess.msg}
          showConfirmButton
          confirmText='OK'
          onConfirmPressed={() => {
            setShowSuccess({ show: false, msg: false });
            navigation.navigate('Reimbursement');
          }}
          onDismiss={() => {
            setShowSuccess({ show: false, msg: false });
            navigation.navigate('Reimbursement');
          }}
        />
      }
    </SafeAreaView>
  )
}

export default reduxForm({
  form: 'applyReimbursement',
  validate: ApplyReimbursementValidation
})(connect(null, { reset })(ApplyReimbursementPage));
