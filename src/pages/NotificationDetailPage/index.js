import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableNativeFeedback,
  useWindowDimensions,
  ScrollView,
  Animated
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { colors, formatDate } from '../../utils';
import SQLiteData from '../../store/SQLiteData';
import { insertDataNotification } from '../../store/actions/CommonAction';
import RenderHtml from 'react-native-render-html';
import { Gap } from '../../components';
import Styles from './style';

const NotificationDetailPage = ({
  navigation,
  route,
  dispatch,
}) => {
  const data = route.params.data;
  const [counter, setCounter] = useState(1);
  const x = useRef(new Animated.Value(0));
  const { width } = useWindowDimensions();

  const viewDetail = async () => {
    const result = await SQLiteData.UpdateQuery(1, route.params.data.id);
    if (result) {
      const dataQuery = await SQLiteData.SelectQuery();
      if (dataQuery) dispatch(insertDataNotification(dataQuery));
    }
  }

  useEffect(() => {
    viewDetail();
    const id = setInterval(() => {
      setCounter(v => v + 1);
    }, (5 * 1000) + 1000);

    return () => clearInterval(id)
  }, []);

  useEffect(() => {
    if (counter % 2 !== 0) Animated.timing(x.current, {
      toValue: -300,
      delay: 1000,
      duration: 5 * 1000, // miliseconds
      useNativeDriver: false
    }).start(() => x.current = new Animated.Value(0));
  }, [counter]);

  return (
    <SafeAreaView>
      <View style={Styles.header}>
        <View style={Styles.backBtn}>
          <TouchableNativeFeedback
            onPress={() => setTimeout(() => navigation.goBack(), 100)}
            background={TouchableNativeFeedback.Ripple(
              colors.colorVariables.white
            )}>
            <View style={Styles.backBtnItem}>
              <MaterialIcons
                name='keyboard-arrow-left'
                size={responsiveFontSize(3.7)}
                color={colors.colorVariables.white}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={Styles.detailHeaderWrapp}>
          <View style={Styles.iconWrapp}>
            <Icon
              name={data.icon}
              size={responsiveFontSize(3)}
              color='rgba(0, 0, 0, 0.5)'
            />
          </View>
          <View>
            <Text style={Styles.textTitle}>{data.title}</Text>
            <View style={{ height: responsiveFontSize(2.5) }}>
              {counter % 2 === 0 ?
                <Text style={Styles.textBody}>{
                  new Date(data.createdAt).getUTCDate() > new Date().getUTCDate() ?
                    new Date().getUTCDate() === new Date(data.createdAt).getUTCDate() + 1 ?
                      'Yesterday' : formatDate(data.createdAt, true) : moment(data.createdAt).format('HH:mm')
                }</Text>
                :
                <View style={Styles.textSubjectWrapper}>
                  <Animated.Text
                    style={[Styles.textSubject, { transform: [{ translateX: data.subject && data.subject.length > 40 ? x.current : 0 }] }]}>
                    {data.subject}
                  </Animated.Text>
                </View>}
            </View>
          </View>
        </View>
        <View style={Styles.headerRightSeparator}></View>
      </View>
      <ScrollView
        style={{ paddingHorizontal: responsiveWidth(5) }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode='none'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ flexGrow: 1 }}>
        <Gap height={2} />
        <RenderHtml
          contentWidth={width}
          source={{ html: data.content }}
        />
        <Gap height={20} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default connect()(NotificationDetailPage);
