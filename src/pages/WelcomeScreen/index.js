import React, { useEffect } from 'react';
import { Text, View, ImageBackground, Image, StatusBar, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import changeNavigationBarColor, { showNavigationBar } from 'react-native-navigation-bar-color';
import LinearGradient from 'react-native-linear-gradient';
import { ICLogoApp, ILWelcome1, ILWelcome2 } from '../../assets';
import { Button, Carousel } from '../../components';
import { colors } from '../../utils';
import Styles from './style';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const ImageData = [
  {
    id: 1,
    title: 'Welcome To Absensi Mobile',
    description: 'Can be accessed from anywhere and anytime. Make the work experience easier with the Absensi Mobile app.',
    url: ICLogoApp,
    style: {
      width: responsiveWidth(50),
      height: responsiveWidth(50),
    }
  },
  {
    title: 'Get the job done anywhere',
    url: ILWelcome1,
    description: 'Employees can log in anytime and anywhere to make applications such as leave, absences, and reimbursements.',
    id: 2,
  },
  {
    title: 'Push notification feature',
    url: ILWelcome2,
    description: `We want to make sure you don't miss anything important.`,
    id: 3,
  },
];

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    showNavigationBar();
    changeNavigationBarColor(colors.colorVariables.whiteSmoke3, true);
  }, []);

  const RenderItem = ({ item }) => {
    return (
      <View style={Styles.ItemRenderWrapper}>
        <Image
          source={item.url}
          resizeMode="contain"
          resizeMethod="resize"
          style={[Styles.imageLogo, item.style]}
        />
        <View style={Styles.wrapperText}>
          <Text style={Styles.textTitle}>{item.title}</Text>
          <Text style={Styles.textDesc}>{item.description}</Text>
        </View>
      </View>
    )
  }

  return (
    <View
      style={Styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <Carousel
        delay={8000}
        style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
        autoplay={false}
        pageInfo
        arrows={true}
        arrowStyle={Styles.arrowStyle}
        rightArrowStyle={Styles.rightArrowStyle}
        onNavigatePage={() => navigation.replace('LoginPage')}
      // onAnimateNextPage={(p) => console.log(p)}
      >
        {ImageData.map((img, idx) => (
          <RenderItem item={img} key={`welcome-${idx}`} />
        ))}
      </Carousel>
    </View>
  );
}

export default WelcomeScreen;
