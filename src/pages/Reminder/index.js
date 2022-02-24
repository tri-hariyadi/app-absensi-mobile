import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  ToastAndroid,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import DatePicker from 'react-native-date-picker'
import Switches from 'react-native-switches';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveFontSize, responsiveScreenFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Gap, Header, Button } from '../../components';
import { colors, customFont } from '../../utils';
import { getData, removeData, storeData } from '../../store/localStorage';
import { showMessage } from 'react-native-flash-message';
import ReactNativeAN from 'react-native-alarm-notification';

const { RNAlarmNotification } = NativeModules;

const alarmNotifData = {
  title: 'Reminder Absensi Mobile',
  message: 'Reminder cukk',
  vibrate: true,
  play_sound: true,
  schedule_type: 'once',
  channel: 'wakeup',
  data: { content: 'my notification id is 22' },
  loop_sound: true,
  has_button: true,
  auto_cancel: true,
  small_icon: 'ic_launcher',
  large_icon: 'ic_launcher',
};

const Reminder = ({ navigation }) => {
  const LIST_DAYS = useRef(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).current;
  const [time, setTime] = useState(new Date());
  const [clockRemind, setClockRemind] = useState({ in: false, out: false });
  const [open, setOpen] = useState({ in: false, out: false });
  const [clockValue, setClockValue] = useState({ in: null, out: null });
  const [pickerWidth, setPickerWidth] = useState(0);
  const [dayValue, setDayValue] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false
  });

  useEffect(() => {
    viewAlarms();
    viewListAlarm();
  }, []);

  const viewAlarms = async () => {
    const list = await ReactNativeAN.getScheduledAlarms();
    const b = list.filter(v => v.alarmId)
    console.log(b);
  }

  const viewListAlarm = async () => {
    const listAlarm = await getData('listreminderclock');
    console.log(listAlarm);
  }

  const setAlarm = async (date, notifData, days) => {
    Object.keys(days).forEach(async (key) => {
      if (dayValue[key]) {
        const fireDate = ReactNativeAN.parseDate(new Date(moment(date).format('DD-MM-YYYY HH:mm:ss')));
        if (LIST_DAYS[new Date().getDay()] === key) {
          const details = {
            ...notifData,
            fire_date: fireDate
          };
          console.log(`alarm set: ${fireDate}`);

          try {
            console.log('Fire-Date => ', date);
            const alarm = await ReactNativeAN.scheduleAlarm(details);
            console.log(alarm);
            if (alarm) {
              const update = await getData('listreminderclock');
              if (update) await storeData('listreminderclock', [...update, { date: `alarm set: ${fireDate}`, id: alarm.id }]);
              else await storeData('listreminderclock', [{ date: `alarm set: ${fireDate}`, id: alarm.id }]);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    });
  };

  const setFutureAlarm = async (date, notifData, days) => {
    const _seconds = parseInt(date, 10) * 60 * 1000;
    const fire_date = ReactNativeAN.parseDate(new Date(Date.now() + _seconds));

    const details = {
      ...notifData,
      fire_date,
    };
    console.log(`alarm set: ${fire_date}`);

    try {
      const alarm = await ReactNativeAN.scheduleAlarm(details);
      console.log(alarm);
      if (alarm) {
        const update = await getData('listreminderclock');
        if (update) await storeData('listreminderclock', [...update, { date: `alarm set: ${fire_date}`, id: alarm.id }]);
        else await storeData('listreminderclock', [{ date: `alarm set: ${fire_date}`, id: alarm.id }]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAlarm = async (idAlarm) => {
    const alarmId = idAlarm;
    if (alarmId !== '') {
      console.log(`delete alarm: ${alarmId}`);

      const id = parseInt(alarmId, 10);
      ReactNativeAN.deleteAlarm(id);
      ToastAndroid.show('Alarm deleted!', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    if (clockRemind.in && !clockValue.in) {
      setOpen({ out: false, in: true })
    } else if (clockRemind.out && !clockValue.out) {
      setOpen({ out: true, in: false });
    }

    if (!clockRemind.in && clockValue.in) {
      setClockValue(v => ({ ...v, in: null }));
    } else if (!clockRemind.out && clockValue.out) {
      setClockValue(v => ({ ...v, out: null }));
    }
  }, [clockRemind]);

  const onSubmit = async () => {
    if (!clockValue.in || !clockValue.out || Object.values(dayValue).every(v => v === false)) {
      showMessage({
        message: 'Failed, Clock In/Out is required and minimum\n1 day selected.',
        type: 'danger',
        duration: 3000,
        position: 'bottom',
        style: {
          top: -50,
          borderRadius: 8,
          alignSelf: 'center',
        },
        titleStyle: {
          fontSize: 14,
          fontFamily: customFont.primary[400],
          textAlign: 'center'
        },
      });
    } else {
      const listAlarm = await getData('listreminderclock');
      if (listAlarm && listAlarm.length > 0) {
        listAlarm.forEach(v => deleteAlarm(v.id));
        await removeData('listreminderclock');
      }
      let duration = moment.duration(moment(clockValue.out).diff(moment(clockValue.in)));
      let minutes = duration.asMinutes();
      if (clockValue.in) {
        alarmNotifData['message'] = `it's time for working hours, don't forget to clock in!`;
        await setAlarm(clockValue.in, alarmNotifData, dayValue);
        if (clockValue.out) {
          alarmNotifData['message'] = `it's time to go home, don't forget to clock out!`;
          await setFutureAlarm(minutes, alarmNotifData, dayValue)
          showMessage({
            message: 'Success Set Reminder Clock In/Out.',
            type: 'success',
            duration: 2600,
            position: 'bottom',
            style: {
              top: -110,
              borderRadius: 8,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            },
            titleStyle: {
              fontSize: 14,
              fontFamily: customFont.primary[400]
            },
          });
        }
      }
    }
  }

  return (
    <SafeAreaView style={Styles.container}>
      <Header
        title='Reminder Clock In/Out'
        background={colors.colorVariables.purple1}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}>
        <Gap height={4} />
        <View style={[Styles.row, Styles.content]}>
          <Text style={Styles.textTitle}>Reminder Clock In</Text>
          <Switches
            shape='pill'
            onChange={() => setClockRemind(v => ({ ...v, in: !v.in }))}
            value={clockRemind.in}
            showText={false}
            sliderHeight={20}
            sliderWidth={40}
            buttonSize={22}
            buttonColor='#00bfa5'
            colorSwitchOn='#a7ffeb'
            borderColor='transparent'
            animationDuration={200} />
        </View>
        <Gap height={2} />
        {clockRemind.in &&
          <TouchableOpacity
            onPress={() => setOpen({ in: true, out: false })}
            style={Styles.content}>
            <Text style={Styles.textTitle2}>Clock In</Text>
            <Text style={[Styles.textTitle2, { marginBottom: 0, color: '#000' }]}>
              {clockValue.in ? moment(clockValue.in).format('HH:mm') : '-'}
            </Text>
          </TouchableOpacity>
        }
        <View style={Styles.separator} />
        <Gap height={2} />
        <View style={[Styles.row, Styles.content]}>
          <Text style={Styles.textTitle}>Reminder Clock Out</Text>
          <Switches
            shape='pill'
            onChange={() => setClockRemind(v => ({ ...v, out: !v.out }))}
            value={clockRemind.out}
            showText={false}
            sliderHeight={20}
            sliderWidth={40}
            buttonSize={22}
            buttonColor='#00bfa5'
            colorSwitchOn='#a7ffeb'
            borderColor='transparent'
            animationDuration={200} />
        </View>
        <Gap height={2} />
        {!(clockRemind.in || clockRemind.out) && <View style={Styles.separator} />}
        {clockRemind.out &&
          <TouchableOpacity
            onPress={() => setOpen({ in: false, out: true })}
            style={Styles.content}>
            <Text style={Styles.textTitle2}>Clock Out</Text>
            <Text style={[Styles.textTitle2, { marginBottom: 0, color: '#000' }]}>
              {clockValue.out ? moment(clockValue.out).format('HH:mm') : '-'}
            </Text>
          </TouchableOpacity>
        }
        <Gap height={2} />
        {(clockRemind.in || clockRemind.out) &&
          <View style={Styles.daysRemindWrapp}>
            <Text style={[Styles.textTitle2, { marginBottom: 0 }]}>Days Reminder</Text>
          </View>
        }
        {(clockRemind.in || clockRemind.out) && LIST_DAYS.map((v, idx) => (
          <View key={`days-${idx}`}>
            <View style={Styles.content}>
              <Gap height={2} />
              <View style={Styles.row}>
                <Text style={[Styles.textTitle2, { marginBottom: 0, color: '#000' }]}>{v}</Text>
                <TouchableOpacity
                  onPress={() => setDayValue(val => ({ ...val, [v]: !val[v] }))}
                  style={{
                    backgroundColor: dayValue[v] ? '#00bfa5' : 'transparent',
                    borderRadius: 5,
                    padding: 2,
                    borderWidth: 1,
                    borderColor: dayValue[v] ? '#00bfa5' : colors.colorVariables.indigo1,
                    marginRight: 5
                  }}>
                  <Icon
                    name={dayValue[v] ? 'check' : 'check-box-outline-blank'}
                    color={dayValue[v] ? '#FFF' : 'transparent'}
                    size={responsiveFontSize(2.3)} />
                </TouchableOpacity>
              </View>
              <Gap height={2} />
            </View>
            <View style={[Styles.separator, { marginTop: 0 }]} />
          </View>
        ))}
        <Gap height={5} />
        <View style={Styles.content}>
          <Button
            background={colors.colorVariables.purple1}
            type='primary'
            borderRadius={12}
            onPress={onSubmit}>
            Submit
          </Button>
        </View>
        <Modal
          animationType='fade'
          visible={open.in}
          transparent
          onRequestClose={() => {
            setOpen(v => ({ ...v, in: false }))
            if (!clockValue.in) setClockRemind(v => ({ ...v, in: false }))
          }}>
          <TouchableWithoutFeedback
            accessible={false}
            disabled={!open.in}
            onPress={() => {
              setOpen(v => ({ ...v, in: false }))
              if (!clockValue.in) setClockRemind(v => ({ ...v, in: false }))
            }}>
            <View style={Styles.pickerContainer}>
              <View style={Styles.pickerWrapper} onLayout={(e) => setPickerWidth(Number(e.nativeEvent.layout.width))}>
                <View style={{ alignSelf: 'stretch', paddingTop: 15 }}>
                  <Text style={Styles.textTitlePicker}>Pick Time</Text>
                  <View style={[Styles.separator, { borderBottomColor: colors.colorVariables.greenLightDark1 }]} />
                </View>
                <DatePicker
                  mode='time'
                  date={time}
                  onDateChange={(date) => setClockValue(v => ({ ...v, in: date }))}
                  style={{ margin: 10, alignSelf: 'center', width: pickerWidth }}
                />
                <View style={Styles.btnPickerWrapp}>
                  <TouchableOpacity
                    style={[Styles.btnPicker, Styles.btnCancel]}
                    onPress={() => {
                      setOpen(v => ({ ...v, in: false }));
                      setClockValue(v => ({ ...v, in: null }));
                      setClockRemind(v => ({ ...v, in: false }));
                    }}>
                    <Text style={Styles.textBtnPicker}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[Styles.btnPicker, Styles.btnOK]}
                    onPress={() => {
                      setOpen(v => ({ ...v, in: false }));
                      if (!clockValue.in) setClockRemind(v => ({ ...v, in: false }));
                    }}>
                    <Text style={Styles.textBtnPicker}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType='fade'
          visible={open.out}
          transparent
          onRequestClose={() => {
            setOpen(v => ({ ...v, out: false }))
            if (!clockValue.out) setClockRemind(v => ({ ...v, out: false }))
          }}>
          <TouchableWithoutFeedback
            accessible={false}
            disabled={!open.out}
            onPress={() => {
              setOpen(v => ({ ...v, out: false }))
              if (!clockValue.out) setClockRemind(v => ({ ...v, out: false }))
            }}>
            <View style={Styles.pickerContainer}>
              <View style={Styles.pickerWrapper} onLayout={(e) => setPickerWidth(Number(e.nativeEvent.layout.width))}>
                <View style={{ alignSelf: 'stretch', paddingTop: 15 }}>
                  <Text style={Styles.textTitlePicker}>Pick Time</Text>
                  <View style={[Styles.separator, { borderBottomColor: colors.colorVariables.greenLightDark1 }]} />
                </View>
                <DatePicker
                  mode='time'
                  date={time}
                  onDateChange={(date) => setClockValue(v => ({ ...v, out: date }))}
                  style={{ margin: 10, alignSelf: 'center', width: pickerWidth }}
                />
                <View style={Styles.btnPickerWrapp}>
                  <TouchableOpacity
                    style={[Styles.btnPicker, Styles.btnCancel]}
                    onPress={() => {
                      setOpen(v => ({ ...v, out: false }));
                      setClockValue(v => ({ ...v, out: null }));
                      setClockRemind(v => ({ ...v, out: false }));
                    }}>
                    <Text style={Styles.textBtnPicker}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[Styles.btnPicker, Styles.btnOK]}
                    onPress={() => {
                      setOpen(v => ({ ...v, out: false }));
                      if (!clockValue.out) setClockRemind(v => ({ ...v, out: false }));
                    }}>
                    <Text style={Styles.textBtnPicker}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Gap height={12} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Reminder;

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.colorVariables.white,
  },
  content: {
    marginHorizontal: responsiveWidth(5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textTitle: {
    fontFamily: customFont.secondary[600],
    fontSize: 16,
    color: colors.colorVariables.indigo1
  },
  textTitle2: {
    fontFamily: customFont.secondary[600],
    fontSize: 14,
    color: colors.colorVariables.black2,
    marginBottom: 5
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: colors.colorVariables.whiteSmoke2,
    marginTop: 10
  },
  daysRemindWrapp: {
    backgroundColor: colors.colorVariables.whiteSmoke,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderBottomColor: colors.colorVariables.whiteSmoke2,
    borderTopColor: colors.colorVariables.whiteSmoke2,
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: responsiveWidth(5)
  },

  //Time Picker
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.4)',
    paddingHorizontal: responsiveWidth(10)
  },
  pickerWrapper: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'stretch'
  },
  textTitlePicker: {
    fontFamily: customFont.secondary[600],
    color: colors.colorVariables.indigo1,
    marginLeft: 15,
    fontSize: responsiveScreenFontSize(1.9)
  },
  btnPickerWrapp: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  btnPicker: {
    borderTopWidth: 2,
    borderTopColor: colors.colorVariables.whiteSmoke2,
    flex: 1,
    paddingVertical: 15,
  },
  btnCancel: {
    borderBottomLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: colors.colorVariables.whiteSmoke2
  },
  btnOK: {
    borderBottomRightRadius: 10,
    borderLeftWidth: 1,
    borderLeftColor: colors.colorVariables.whiteSmoke2
  },
  textBtnPicker: {
    textAlign: 'center',
    fontFamily: customFont.secondary[600],
    color: colors.colorVariables.indigo1
  }
});
