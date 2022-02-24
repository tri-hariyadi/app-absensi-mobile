import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Modal,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import ImagePicker from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Gap, Header, SelectField, TextField, ModalDatePicker, Button, Alert } from '../../components';
import { colors } from '../../utils';
import { offWork } from '../../store/actions/TransactionAction';
import { getAllTypeOffWork, resetAllCommonReducer } from '../../store/actions/CommonAction';
import Styles from './style';
import { getData } from '../../store/localStorage';
import jwtDecode from 'jwt-decode';

const OffWorkPage = ({
  navigation,
  handleSubmit,
  reset,
  resetAllCommonReducer,
  getAllTypeOffWork,
  getTypeOffWorkLoading,
  getTypeOffWorkData,
  getTypeOffWorkError
}) => {
  const modalPickerRef = useRef();
  const tokenRef = useRef();
  const [photoUri, setPhotoUri] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: 'success', msg: '', title: '' });

  useEffect(() => {
    const getDataUser = async () => {
      const token = await getData('token');
      if (token) tokenRef.current = jwtDecode(token.accessToken).idUser;
    }
    getDataUser();
    getAllTypeOffWork();

    return () => {
      resetAllCommonReducer();
    }
  }, []);

  const onFocusDateBirth = name => {
    Keyboard.dismiss();
    modalPickerRef.current.name = name;
    modalPickerRef.current.show();
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

  const onBtnAlertPressed = type => {
    if (type === 'success') navigation.navigate('MainApp');
    else setAlert({ show: false, type, msg: '', title: '' });
  }

  const onSubmit = async values => {
    setSubmitLoading(true);
    let result = await offWork({
      payload: { ...values, userId: tokenRef.current, status: '3' },
      imageUri
    });
    if (result) {
      setAlert({
        show: true,
        type: 'success',
        msg: result,
        title: 'Success'
      });
      reset('formOffWork');
    } else setAlert({
      show: true,
      type: 'error',
      msg: 'Failed sent leave from work, please try again!',
      title: 'Error'
    });
    setSubmitLoading(false);
  }

  return (
    <SafeAreaView style={Styles.container}>
      <Header
        title='Off Work'
        background={colors.colorVariables.purple1}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode='none'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ flexGrow: 1 }}>
        <View style={Styles.contentWrapper}>
          <Gap height={2} />
          <Field
            name='typeOffWork'
            options={getTypeOffWorkData}
            noOptionMessages={getTypeOffWorkError}
            isLoading={getTypeOffWorkLoading}
            component={SelectField}
            iconName='contact-support'
            label='Type Off Work'
            dropdownStyle={{ left: 13, width: '90%', position: 'relative' }}
          />
          <Gap height={1.5} />
          <Field
            name='startOffWork'
            iconName='event'
            component={TextField}
            returnKeyType='next'
            label='Start date of work leave'
            autoCapitalize='words'
            onFocusTextField={() => onFocusDateBirth('startOffWork')}
            showSoftInputOnFocus
          />
          <Gap height={1.5} />
          <Field
            name='endOffWork'
            iconName='event'
            component={TextField}
            returnKeyType='next'
            label='End date of work leave'
            autoCapitalize='words'
            onFocusTextField={() => onFocusDateBirth('endOffWork')}
            showSoftInputOnFocus
          />
          <Gap height={1.5} />
          <Field
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
          <Gap height={2} />
          <View style={Styles.card}>
            <View style={Styles.cardHeader}>
              <Text style={Styles.labelUpload}>
                Proof of Work Leave
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
                (Optional) You can upload proof of leave from work
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
                    <Modal visible={showImageViewer} transparent={true}>
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
                </TouchableHighlight>
              }
            </View>
          </View>
          <Gap height={2} />
          <Button
            background={colors.colorVariables.purple1}
            type='primary'
            borderRadius={10}
            onPress={handleSubmit(onSubmit)}
            isLoading={submitLoading}
            iconName='send'>
            {' '}Submit
          </Button>
          <Gap height={3} />
        </View>
      </ScrollView>
      <ModalDatePicker ref={modalPickerRef} form='formOffWork' />
      <Alert
        show={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.msg}
        showConfirmButton={alert.type === 'success'}
        showCancelButton={alert.type === 'error'}
        confirmText='OK'
        cancelText='OK'
        onCancelPressed={() => onBtnAlertPressed(alert.type)}
        onConfirmPressed={() => onBtnAlertPressed(alert.type)}
        onDismiss={() => setAlert({ show: false, type: alert.type, msg: '', title: '' })}
      />
    </SafeAreaView>
  )
}

const mapStateToProps = state => ({
  getTypeOffWorkLoading: state.CommonReducer.getTypeOffWorkLoading,
  getTypeOffWorkData: state.CommonReducer.getTypeOffWorkData,
  getTypeOffWorkError: state.CommonReducer.getTypeOffWorkError,
});

export default reduxForm({
  form: 'formOffWork'
})(connect(mapStateToProps, {
  reset,
  getAllTypeOffWork,
  resetAllCommonReducer
})(OffWorkPage));
