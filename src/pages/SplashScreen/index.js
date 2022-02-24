import React, { useEffect } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import * as Animatable from 'react-native-animatable';
import { ICLogoApp } from '../../assets';
import { AnimateLogo } from '../../utils';
import { getData } from '../../store/localStorage';
import Styles from './style';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    try {
      hideNavigationBar();
    } catch (err) {
      console.log(err);
    }
    setTimeout(async () => {
      const token = await getData('token');
      if (token) {
        showNavigationBar();
        navigation.replace('MainApp')
      }
      else navigation.replace('WelcomeScreen');
    }, 3500);
  }, []);

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <View style={Styles.container}>
        <Animatable.View
          animation={AnimateLogo}
          easing='ease'
          duration={1200}
        >
          <Image source={ICLogoApp} style={Styles.imageLogo} />
        </Animatable.View>
        <Animatable.View
          animation="fadeInUpBig"
          easing='ease'
          duration={1500}
        >
          <Text style={Styles.textLogo}>Absensi Mobile</Text>
        </Animatable.View>
      </View>
    </>
  )
}

export default SplashScreen;
