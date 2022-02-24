import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Text,
  View,
  Image,
  Easing,
  Animated,
  StatusBar,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import changeNavigationBarColor, { showNavigationBar } from 'react-native-navigation-bar-color';
import { ILNoData, ILNullPhoto } from '../../assets';
import { Button, Gap, Accordion } from '../../components';
import { colors, customFont, dateFormat, sendFcmToken } from '../../utils';
import Styles from './style';
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import { getData } from '../../store/localStorage';
import { getLatestAbsents, getUserById } from '../../store/actions/CommonAction';
import { LoadingScreen, ListItem, Alert, ActionButton } from '../../components';

const HomePage = props => {
  const scrollViewRef = useRef();
  const animatedOverlayMenu = useRef(new Animated.Value(0)).current;
  const [showOverlayMenu, setShowOverlayMenu] = useState(false);
  const [tokenDecoded, setTokenDecoded] = useState(false);
  const [loadingPage, setLoadingPage] = useState('true');
  const [imageUri, setImageUri] = useState(ILNullPhoto);
  const [status, setStatus] = useState({
    timeIn: `--:--`,
    timeOut: '--:--',
    statusIn: false,
    statusOut: false,
  });
  const [statusAbsent, setStatusAbsent] = useState(false);
  const [showAlertAbsent, setShowAlertAbsent] = useState(false);
  const isFocused = useIsFocused();
  const { navigation } = props;
  const dispatch = useDispatch();
  const {
    getLatestAbsentsData,
    getLatestAbsentsError,
    getUserByIdData
  } = useSelector(state => ({
    getLatestAbsentsData: state.CommonReducer.getLatestAbsentsData,
    getLatestAbsentsError: state.CommonReducer.getLatestAbsentsError,
    getUserByIdData: state.CommonReducer.getUserByIdData
  }));

  const onBtnOverlayMenuPressed = () => {
    setShowOverlayMenu(!showOverlayMenu)
    animatedOverlayMenu.setValue(0)
    Animated.timing(animatedOverlayMenu, {
      toValue: 1,
      duration: 700,
      easing: Easing.quad,
      useNativeDriver: false
    }).start();
  }

  const overlayMenuStyle = {
    height: animatedOverlayMenu.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 240]
    }),
    width: animatedOverlayMenu.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 240]
    }),
    opacity: animatedOverlayMenu.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0, 0.3, 1]
    }),
  }

  const showOverlayView = () => {
    Animated.timing(animatedOverlayMenu, {
      toValue: 0,
      duration: 300,
      easing: Easing.quad,
      useNativeDriver: false
    }).start(() => setShowOverlayMenu(false));
  }

  const getLongTimeWork = (timeIn, timeOut) => {
    let timeWorkDiff = Math.floor((dateFormat(timeOut).time - dateFormat(timeIn).time) / (1000 * 60));
    let restWorkMin = timeWorkDiff % 60;
    if (Math.floor(timeWorkDiff / 60) < 1) return 'a few minutes';
    else return `${Math.floor(timeWorkDiff / 60)} H ${restWorkMin} m`;
  }

  const getImageUri = item => {
    if (item.status === '1') return { uri: `${item.imageIn}` };
    if (item.status === '2') return { uri: `${item.imageOut}` };
  }

  useEffect(() => {
    showNavigationBar();
    changeNavigationBarColor(colors.colorVariables.whiteSmoke3, true);
    setLoadingPage(true);
    const unsubscribe = navigation.addListener('focus', async () => {
      let token = await getData('token');
      setTokenDecoded(jwt_decode(token.accessToken));
      dispatch(getLatestAbsents(jwt_decode(token.accessToken).idUser));
      sendFcmToken();
    });
    return unsubscribe;
  }, [isFocused]);

  useEffect(() => {
    if (Platform.OS !== 'ios') StatusBar.setTranslucent(false);
  });

  useEffect(() => {
    dispatch(getUserById({ id: tokenDecoded.idUser }));
  }, [tokenDecoded]);

  useEffect(() => {
    if (getUserByIdData.image) setImageUri({ uri: getUserByIdData.image });
  }, [getUserByIdData]);

  useMemo(() => {
    if (!isFocused) setShowOverlayMenu(false);
    if (getLatestAbsentsData) {
      setLoadingPage(false);
      getLatestAbsentsData[Object.keys(getLatestAbsentsData)[0]].map((item, idx) => {
        if (moment(item.dateWork).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && idx === 0) {
          if (item.status === '1') {
            setStatusAbsent(true);
            return setStatus({
              timeIn: moment(item.timeIn).utc().format('HH : mm'),
              statusIn: true,
              timeOut: '--:--',
              statusOut: false,
            });
          }

          if (item.status === '2') {
            setStatusAbsent(false)
            return setStatus({
              timeOut: moment(item.timeOut).utc().format('HH : mm'),
              statusOut: true,
              timeIn: moment(item.timeIn).utc().format('HH : mm'),
              statusIn: false
            });
          }
        }
      });
    }

    if (getLatestAbsentsError) setLoadingPage(false);
  }, [isFocused, getLatestAbsentsData, getLatestAbsentsError]);

  return (
    <>
      <StatusBar
        backgroundColor={colors.colorVariables.purple1}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <SafeAreaView style={Styles.container}>
        <View
          style={[Styles.content, { paddingVertical: 10 }]}
          onTouchStart={showOverlayView}>
          <View style={Styles.textGroup}>
            <Text style={[Styles.textGroup, { paddingVertical: 0, paddingHorizontal: 0 }]}>
              {tokenDecoded.organisation}
            </Text>
          </View>
        </View>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='none'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flexGrow: 1 }}
          onTouchStart={showOverlayView}>
          <Gap height={1} />
          <View style={Styles.card}>
            <View style={Styles.cardBodyProfile}>
              <View style={{ flex: 1 }}>
                <Text style={Styles.nameProfile}>{tokenDecoded.username}</Text>
                <Gap height={0.8} />
                <Text style={Styles.departmentProfile}>{tokenDecoded.division}</Text>
              </View>
              <View>
                <Image
                  source={imageUri}
                  onError={() => setImageUri(ILNullPhoto)}
                  style={Styles.imageProfile} />
              </View>
            </View>
            <Gap height={3} />
            <View style={Styles.cardBodyProfile}>
              <View style={Styles.cardBodyTap}>
                <Text style={Styles.textTap}>tap in</Text>
                <Gap height={1.5} />
                <View>
                  <View style={Styles.timeAttendance}>
                    <View style={Styles.timeAttendanceItem}>
                      <Icon
                        name={status.statusIn ? 'radio-button-checked' : 'radio-button-unchecked'}
                        size={responsiveFontSize(2.5)}
                        color={colors.colorVariables.white}
                      />
                      <Gap width={1} />
                      <Text style={Styles.textDay}>{status.timeIn}</Text>
                    </View>
                    <Text style={Styles.textDay}>Today</Text>
                  </View>
                </View>
              </View>
              <View style={Styles.cardBodyTap}>
                <Text style={Styles.textTap}>tap out</Text>
                <Gap height={1.5} />
                <View>
                  <View style={Styles.timeAttendance}>
                    <View style={Styles.timeAttendanceItem}>
                      <Icon
                        name={status.statusOut ? 'radio-button-checked' : 'radio-button-unchecked'}
                        size={responsiveFontSize(2.5)}
                        color={colors.colorVariables.white}
                      />
                      <Gap width={1} />
                      <Text style={Styles.textDay}>{status.timeOut}</Text>
                    </View>
                    <Text style={Styles.textDay}>Today</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <Gap height={2} />
          <View style={Styles.content}>
            <Text style={Styles.textAttendance}>Attendance</Text>
            <Gap height={2} />
            {getLatestAbsentsData &&
              Object.keys(getLatestAbsentsData).map((key, idx) => {
                return (
                  <View key={`group-${idx}`}>
                    <Accordion
                      borderRadius
                      labelIcon='event-note'
                      expanded={idx === 0}
                      noPadding
                      label={`${key} ${new Date(getLatestAbsentsData[key][0].dateWork).getFullYear()}`}>
                      {getLatestAbsentsData[key] &&
                        getLatestAbsentsData[key].map((item, idx) => {
                          return (
                            <View style={{ overflow: 'hidden' }} key={`absets-${idx}`}>
                              <ListItem
                                rippleColor='rgba(200, 200, 200, 0.8)'
                                onPress={() => item.status !== '3' ?
                                  props.navigation.navigate('AttendanceOutPage', { idAbsent: item._id }) : null}>
                                <View style={Styles.listAttendance}>
                                  <Gap height={1.5} />
                                  <View style={Styles.cardBodyProfile}>
                                    <View style={Styles.timeAttendanceItem}>
                                      <View>
                                        <Image
                                          source={ILNullPhoto}
                                          style={[Styles.imageProfile2, { position: 'absolute', zIndex: -1 }]}
                                        />
                                        <Image
                                          source={getImageUri(item)}
                                          style={Styles.imageProfile2}
                                        />
                                      </View>
                                      <Gap width={3} />
                                      <View style={{ alignItems: 'flex-start' }}>
                                        <Text style={Styles.listAttendanceDate}>{dateFormat(item.dateWork, 'DDDD, MMMM DD')}</Text>
                                        {item.status === '2' &&
                                          <View>
                                            <Gap height={0.6} />
                                            <Text style={[Styles.textDay, { color: colors.colorVariables.redLight1 }]}>
                                              Worked for {getLongTimeWork(item.timeIn, item.timeOut)}
                                            </Text>
                                          </View>
                                        }
                                        {item.status === '1' && new Date(item.timeIn).getUTCDate() !== new Date().getDate() &&
                                          <View>
                                            <Gap height={0.6} />
                                            <Text style={[Styles.textDay, { color: colors.colorVariables.yellowDark }]}>
                                              You've missed leave attendance
                                            </Text>
                                          </View>
                                        }
                                        {item.status === '3' &&
                                          <View>
                                            <Gap height={0.6} />
                                            <Text style={[Styles.textDay, { color: colors.colorVariables.danger, fontFamily: customFont.primary[700] }]}>
                                              Off Work
                                            </Text>
                                          </View>
                                        }
                                      </View>
                                    </View>
                                    <View>
                                      <Text style={[Styles.textAttendance, { fontSize: responsiveFontSize(1.8) }]}>
                                        {moment(item.timeIn).utc().format('HH:mm')}
                                      </Text>
                                      {item.status !== '3' &&
                                        <View>
                                          <Gap height={0.6} />
                                          {item.status === '1' ?
                                            new Date(item.timeIn).getUTCDate() === new Date().getDate() ?
                                              <Text style={Styles.listAttendanceWork}>working</Text>
                                              :
                                              null
                                            :
                                            <Text style={Styles.textAttendance2}>{moment(item.timeOut).utc().format('HH:mm')}</Text>
                                          }
                                        </View>
                                      }
                                    </View>
                                  </View>
                                  <Gap height={1.5} />
                                </View>
                              </ListItem>
                            </View>
                          );
                        })
                      }
                      <Gap height={1.5} />
                    </Accordion>
                    <Gap height={1.5} />
                  </View>
                );
              })
            }
            {getLatestAbsentsError &&
              <View style={Styles.errorDataContainer}>
                <Gap height={5} />
                <Image
                  source={ILNoData}
                  style={Styles.iconNoData}
                />
                <Text style={Styles.textNoData}>{getLatestAbsentsError}</Text>
              </View>
            }
            <Gap height={1.5} />
            <Gap height={18} />
          </View>
        </ScrollView>
        {/* <Button
          BtnIcon
          iconName='add'
          type='danger'
          containerBtnIconStyle={Styles.btnIconStyle}
          onPress={onBtnOverlayMenuPressed}
        /> */}
        {/* {showOverlayMenu &&
          <Animated.View style={[Styles.overlayMenuWrapper, overlayMenuStyle]}>
            <View style={Styles.viewAddAttendance}>
              <Text style={Styles.textViewOverlay}>Add Attendance</Text>
              <Gap width={2} />
              <Button
                BtnIcon
                iconName='fingerprint'
                type='warning'
                containerBtnIconStyle={{
                  position: 'relative',
                  right: 30,
                  top: -60
                }}
                onPress={() => {
                  if (!statusAbsent) props.navigation.navigate('AddAttendancePage');
                  else setShowAlertAbsent(true);
                }}
              />
            </View>
            <View style={Styles.viewOut}>
              <Text style={Styles.textViewOverlayIzin}>Off Work</Text>
              <Gap width={2} />
              <Button
                BtnIcon
                iconName='power-settings-new'
                type='danger'
                containerBtnIconStyle={{
                  position: 'relative',
                  right: 40,
                  bottom: -60
                }}
                onPress={() => {
                  props.navigation.navigate('OffWorkPage');
                  showOverlayView();
                }}
              />
            </View>
          </Animated.View>
        } */}
        <ActionButton
          buttonColor={colors.colorVariables.danger}
          bgColor='rgba(0,0,0, 0.3)'
          nativeFeedbackRippleColor={colors.colorVariables.white}
          offsetX={15} offsetY={15}
          fixNativeFeedbackRadius>
          <ActionButton.Item
            buttonColor='#3498db'
            title="Off Work"
            nativeFeedbackRippleColor={colors.colorVariables.white}
            onPress={() => {
              if (!statusAbsent) props.navigation.navigate('OffWorkPage');
              else setShowAlertAbsent(true);
            }}>
            <Icon name="event" style={{ color: colors.colorVariables.white }} size={25} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor={colors.colorVariables.warning}
            title="Add Attendance"
            nativeFeedbackRippleColor={colors.colorVariables.white}
            onPress={() => {
              if (!statusAbsent) props.navigation.navigate('AddAttendancePage');
              else setShowAlertAbsent(true);
            }}>
            <Icon name="fingerprint" size={30} />
          </ActionButton.Item>
        </ActionButton>
        {showAlertAbsent &&
          <Alert
            show={showAlertAbsent}
            type='warning'
            title='Warning'
            message='You are checked in'
            showConfirmButton
            confirmText='OK'
            onConfirmPressed={() => setShowAlertAbsent(false)}
            onDismiss={() => setShowAlertAbsent(false)}
          />
        }
        <LoadingScreen show={loadingPage} />
      </SafeAreaView>
    </>
  )
}

export default HomePage;
