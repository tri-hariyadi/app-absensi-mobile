import React, { useRef } from 'react';
import { Text, View, SafeAreaView, StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as RNLocalize from "react-native-localize";
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Button, Gap, Header } from '../../components';
import { colors } from '../../utils';
import Styles from './style';

const AddAttendancePage = props => {
  const camera = useRef();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const mounts = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const date = new Date().getDate();
  const day = days[new Date().getDay()];
  const month = mounts[new Date().getMonth()];
  const hours = new Date().getHours();
  const min = new Date().getMinutes();
  const timeZone = RNLocalize.getTimeZone();
  const dataAbsent = props.route.params ? props.route.params.dataAbsent : null;

  const takePicture = async () => {
    if (camera.current) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.current.takePictureAsync(options);
      if (data && dataAbsent)
        props.navigation.navigate('DetailAttendancePage', { dataImage: data, dataAbsent, actionType: 'absentOut' });
      if (data) props.navigation.navigate('DetailAttendancePage', { data, actionType: 'absentIn' });
    }
  };
  return (
    <SafeAreaView style={Styles.container}>
      <StatusBar backgroundColor={colors.colorVariables.indigo1} barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} />
      <Header
        title='ATTENDANCE'
        background={colors.colorVariables.indigo1}
        onPress={() => props.navigation.goBack()}
      />
      <View style={Styles.header}>
        <Text style={Styles.textHour}>{hours < 10 ? `0${hours}` : hours} : {min < 10 ? `0${min}` : min}</Text>
        <Gap height={1} />
        <Text style={Styles.textZone}>{timeZone}</Text>
        <Gap height={1} />
        <Text style={[Styles.textZone, { fontSize: responsiveFontSize(2.5) }]}>{day}, {date} {month}</Text>
        <Gap height={2} />
      </View>
      <RNCamera
        ref={camera}
        style={Styles.preview}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      <View style={Styles.btnCaptureContainer}>
        <View style={Styles.btnCaptureWrapper}>
          <Button
            BtnIcon
            large={2}
            iconName="photo-camera"
            type='success'
            containerBtnIconStyle={Styles.containerBtnIconStyle}
            onPress={takePicture}
          />
          <Gap height={0.6} />
          <Text style={Styles.textCapture}>Capture</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AddAttendancePage;
