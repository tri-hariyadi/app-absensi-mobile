import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as RNLocalize from "react-native-localize";
import { Gap, Header, LoadingScreen } from '../../components';
import { colors, customFont, dateFormat } from '../../utils';

import { getAbsentById, resetAllCommonReducer } from '../../store/actions/CommonAction';
import { responsiveFontSize, responsiveScreenFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { ILNoData } from '../../assets';

const mapStateToProps = state => ({
  getAbsentByIdLoading: state.CommonReducer.getAbsentByIdLoading,
  getAbsentByIdData: state.CommonReducer.getAbsentByIdData,
  getAbsentByIdError: state.CommonReducer.getAbsentByIdError,
});

const Button = props => {
  return (
    <View>
      <TouchableOpacity style={[Styles.buttonStyle, props.customStyle]}>
        <Text style={[Styles.textButton, props.customTextButtonStyle]}>{props.title}</Text>
        {props.type &&
          <Icon
            name={props.type}
            size={responsiveScreenFontSize(4)}
            color={colors.colorVariables.black}
          />
        }
      </TouchableOpacity>
    </View>
  )
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const Metrics = {
  containerWidth: DEVICE_WIDTH - 30,
  switchWidth: DEVICE_WIDTH / 2.7
}

const AttendanceOutPage = ({
  navigation,
  route,
  getAbsentById,
  resetAllCommonReducer,
  getAbsentByIdData,
  getAbsentByIdError
}) => {
  const position = useRef(new Animated.Value(0)).current;
  const [posValue, setPosValue] = useState(0);
  const thresholdDistance = DEVICE_WIDTH - 8 - DEVICE_WIDTH / 2.4;
  const mainWidth = DEVICE_WIDTH - 30;
  const switcherWidth = DEVICE_WIDTH / 2.7;
  const duration = 100;
  const disableSwitch = false;
  const [totalWork, setTotalWork] = useState(0);
  const [loadingPage, setLoadingPage] = useState(true);
  const [bgColorSwitcher, setBgColorSwitcher] = useState(colors.colorVariables.redLight1);
  const [toLeaveAbsent, setToLeaveAbsent] = useState(false);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const mounts = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const timeZone = RNLocalize.getTimeZone();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderMove: (evt, gestureState) => {
        if (!disableSwitch) {
          let finalValue = gestureState.dx + posValue;
          if (finalValue >= 0 && finalValue <= thresholdDistance) {
            if (finalValue >= 131 && finalValue <= 280) setBgColorSwitcher(colors.colorVariables.blueLighten1);
            else setBgColorSwitcher(colors.colorVariables.redLight1);
            position.setValue(posValue + gestureState.dx);
          }
        }
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: (evt, gestureState) => {
        if (!disableSwitch) {
          let finalValue = gestureState.dx + posValue;
          if (gestureState.dx > 0) {
            if (finalValue >= 0 && finalValue <= 130) {
              notStartedSelected();
            } else if (finalValue >= 131 && finalValue <= 280) {
              if (gestureState.dx > 0) {
                setBgColorSwitcher(colors.colorVariables.blueLighten1);
                completeSelected().then(() => setToLeaveAbsent(true));
              } else {
                notStartedSelected();
              }
            }
          } else {
            if (finalValue >= -100 && finalValue <= 78) {
              notStartedSelected();
            } else {
              setBgColorSwitcher(colors.colorVariables.blueLighten1);
              completeSelected().then(() => setToLeaveAbsent(true));
            }
          }
        }
      },

      onPanResponderTerminate: () => { },
      onShouldBlockNativeResponder: () => {
        return true;
      }

    })
  ).current;

  const notStartedSelected = () => {
    setBgColorSwitcher(colors.colorVariables.redLight1);
    if (disableSwitch) return;
    Animated.timing(position, {
      toValue: Platform.OS === "ios" ? -2 : 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setPosValue(Platform.OS === "ios" ? -2 : 0);
    }, 100);
  };

  const completeSelected = () => {
    return new Promise((resolve, reject) => {
      if (disableSwitch) return;
      Animated.timing(position, {
        toValue:
          Platform.OS === "ios"
            ? mainWidth - switcherWidth
            : mainWidth - switcherWidth - 2,
        duration: duration,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        setPosValue(
          Platform.OS === "ios"
            ? mainWidth - switcherWidth
            : mainWidth - switcherWidth - 2
        );
        resolve();
      }, 100);
    })
  };

  useEffect(() => {
    const idAbsent = route.params.idAbsent;
    getAbsentById(idAbsent);

    return () => {
      setLoadingPage(true);
      setBgColorSwitcher(colors.colorVariables.redLight1);
      resetAllCommonReducer();
    }
  }, []);

  useEffect(() => {
    if (getAbsentByIdError && loadingPage)
      setLoadingPage(false);
  });

  useEffect(() => {
    if (toLeaveAbsent && getAbsentByIdData)
      navigation.replace('AddAttendancePage', { dataAbsent: getAbsentByIdData });
  }, [toLeaveAbsent])

  useMemo(() => {
    if (getAbsentByIdData) {
      if (getAbsentByIdData.status === '2') completeSelected(false);
      const timeIn = new Date(getAbsentByIdData.timeIn);
      const getTotalTimeWork = () => {
        const currentTime = getAbsentByIdData.status === '2' ? new Date(getAbsentByIdData.timeOut) : new Date();
        let timeWorkDiff = Math.floor((dateFormat(currentTime).time - dateFormat(timeIn).time) / (1000 * 60));
        let restWorkMin = timeWorkDiff % 60;
        if (Math.floor(timeWorkDiff / 60) < 1) setTotalWork('a few minutes')
        else setTotalWork(`${Math.floor(timeWorkDiff / 60)} H ${restWorkMin} m`);
      }
      //before checked out
      if (getAbsentByIdData.status === '1' && new Date().getDate() === new Date(timeIn).getDate())
        getTotalTimeWork();
      //after checked out
      if (getAbsentByIdData.status === '2') getTotalTimeWork();
    }
  }, [getAbsentByIdData]);

  return (
    <View style={Styles.container}>
      <StatusBar backgroundColor={colors.colorVariables.indigo1} barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} />
      <Header
        title='Leave Attendance'
        background={colors.colorVariables.indigo1}
        onPress={() => navigation.goBack()}
      />
      {getAbsentByIdData &&
        <View
          style={Styles.container}
          onLayout={() => setLoadingPage(false)}>
          <ImageBackground
            source={{ uri: getAbsentByIdData.status === '1' ? `${getAbsentByIdData.imageIn}` : `${getAbsentByIdData.imageOut}` }}
            style={Styles.container}
            imageStyle={Styles.backgroundImageStyle}>
            <View style={Styles.header}>
              <Text style={[Styles.textZone, { marginBottom: -5, marginTop: -5 }]}>Clock In</Text>
              <Text style={Styles.textHour}>
                {/* {dateFormat(getAbsentByIdData.timeIn).hours < 10 ? `0${dateFormat(getAbsentByIdData.timeIn).hours}` : dateFormat(getAbsentByIdData.timeIn).hours} : {dateFormat(getAbsentByIdData.timeIn).min < 10 ? `0${dateFormat(getAbsentByIdData.timeIn).min}` : dateFormat(getAbsentByIdData.timeIn).min} */}
                {moment(getAbsentByIdData.timeIn).utc().format('HH:mm')}
              </Text>
              <Text style={Styles.textZone}>{timeZone}</Text>
              <Text style={[Styles.textZone, { fontSize: responsiveFontSize(2.5) }]}>{days[new Date(getAbsentByIdData.timeIn).getDay()]}, {new Date(getAbsentByIdData.timeIn).getDate()} {mounts[new Date(getAbsentByIdData.timeIn).getMonth()]}</Text>
              {getAbsentByIdData.status === '1' && new Date(getAbsentByIdData.timeIn).getDate() !== new Date().getDate() ?
                <Text style={Styles.textZone}>You've missed leave attendance</Text>
                :
                <Text style={Styles.textZone}>Worked for {totalWork}</Text>
              }
            </View>
          </ImageBackground>
          <View style={{ alignItems: 'center', backgroundColor: colors.colorVariables.indigo1 }}>
            <Gap height={1.5} />
            {new Date(getAbsentByIdData.timeIn).getUTCDate() !== new Date().getDate() && getAbsentByIdData.status === '1' ?
              <View style={Styles.wrapperCannotLeave}>
                <Text style={Styles.textCannotLeave}>Can not cheked out because out of date</Text>
              </View>
              :
              <View style={[Styles.containerSlider, getAbsentByIdData.status === '2' && { justifyContent: 'flex-start' }]}>
                {getAbsentByIdData.status === '2' && <Text style={Styles.textCheckedOut} >YOU HAVE CHECKED OUT</Text>}
                {getAbsentByIdData.status !== '2' &&
                  <>
                    <Button />
                    <Button
                      type='check-circle-outline'
                      title='Leave'
                      customStyle={{ justifyContent: 'flex-end' }}
                      customTextButtonStyle={{ marginRight: 5 }} />
                  </>
                }
                {getAbsentByIdData.status !== '2' ?
                  <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                      Styles.switcher,
                      {
                        transform: [{ translateX: position }],
                        backgroundColor: bgColorSwitcher
                      }
                    ]}
                  >
                    <Button type='chevron-right' title='Slide' />
                  </Animated.View>
                  :
                  <Animated.View
                    style={[Styles.switcher, {
                      transform: [{ translateX: position }],
                      backgroundColor: colors.colorVariables.blueLighten1
                    }]}>
                    <Button
                      type='check-circle-outline' />
                  </Animated.View>
                }
              </View>
            }
            <Gap height={1.5} />
          </View>
        </View>
      }
      {!getAbsentByIdData && getAbsentByIdError &&
        <View style={Styles.errorDataContainer}>
          <Gap height={5} />
          <Image
            source={ILNoData}
            style={Styles.iconNoData}
          />
          <Text style={Styles.textNoData}>{getAbsentByIdError}</Text>
        </View>
      }
      <LoadingScreen show={loadingPage} />
    </View>
  )
}

export default connect(mapStateToProps, { getAbsentById, resetAllCommonReducer })(AttendanceOutPage);

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.white,
    justifyContent: 'space-between'
  },
  backgroundImageStyle: {
    resizeMode: 'stretch',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  textHour: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(7),
    color: colors.colorVariables.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  textZone: {
    fontFamily: customFont.secondary[400],
    fontSize: responsiveFontSize(2.5),
    color: colors.colorVariables.white,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 8
  },
  buttonStyle: {
    flex: 1,
    flexDirection: 'row',
    width: Metrics.containerWidth / 2,
    paddingHorizontal: 30,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerSlider: {
    width: Metrics.containerWidth,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: colors.mBackColor,
    borderRadius: 27.5,
    backgroundColor: 'white'
  },
  switcher: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 28,
    height: 53,
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.switchWidth,
    elevation: 4,
    shadowOpacity: 0.31,
    shadowRadius: 10,
    shadowColor: colors.colorVariables.black
  },
  textButton: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.9),
  },
  textCheckedOut: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.6),
    marginLeft: responsiveWidth(6)
  },
  errorDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconNoData: {
    width: responsiveWidth(35),
    height: responsiveWidth(35)
  },
  textNoData: {
    fontFamily: customFont.secondary[700],
    textTransform: 'capitalize',
    color: colors.colorVariables.indigo1,
    fontSize: responsiveFontSize(2.6),
    marginTop: 12
  },
  wrapperCannotLeave: {
    backgroundColor: colors.colorVariables.danger,
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row'
  },
  textCannotLeave: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: 'white'
  }
});

