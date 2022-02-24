import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Gap, Header, ListItem, Alert } from '../../components';
import SQLiteData from '../../store/SQLiteData';
import { colors, customFont } from '../../utils';
import { ILSpinner } from '../../assets';
import { insertDataNotification } from '../../store/actions/CommonAction';

const compare = (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps);
const NotificationPage = React.memo(({
  navigation,
  dispatch,
  dataNotification
}) => {
  const [dataNotifications, setDataNotifications] = useState([]);
  const [loadData, setLoadData] = useState(true);
  const [showAlert, setShowAlert] = useState({
    show: false, data: false, type: 'success', msg: '', title: ''
  });

  const getDataNotification = async () => {
    const data = await SQLiteData.SelectQuery();
    setTimeout(() => {
      if (data.length > 0) {
        dispatch(insertDataNotification(data));
        setDataNotifications(data);
      } else {
        dispatch(insertDataNotification([]));
        setDataNotifications([]);
      }
      setLoadData(false);
    }, 100);
  }

  const bodyFormat = name => {
    if (name && name.length > 36) return name.replace(name.substring(35), '....');
    else return name;
  }

  const onDeleteNotif = async (id) => {
    const data = await SQLiteData.DeleteQuery(id);
    if (data) {
      setShowAlert({
        show: true,
        data: false,
        type: 'success',
        title: 'Success',
        msg: 'Notification has been deleted!'
      });
      getDataNotification();
      const newData = await SQLiteData.SelectQuery();
      dispatch(insertDataNotification(newData));
    } else setShowAlert({
      show: true,
      data: false,
      type: 'error',
      title: 'Error',
      msg: 'Notification is failed to delete, please try again'
    });
  }

  const OnLongPress = (id) => {
    setShowAlert({
      show: true,
      data: id,
      type: 'warning',
      title: 'Are You Sure ?',
      msg: 'You will delete notification, notification that has been deleted cannot be restored!'
    })
  }

  useEffect(() => {
    return () => {
      setLoadData(true);
    }
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDataNotification();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getDataNotification();
  }, [dataNotification]);

  return (
    <SafeAreaView style={Styles.container}>
      <Header
        title='Notification'
        background={colors.colorVariables.purple1}
        onPress={() => navigation.goBack()}
      />
      {dataNotifications.length < 1 ?
        <View style={Styles.emptyItemView}>
          {loadData ?
            <View>
              <Image source={ILSpinner} style={Styles.LoadingSpinner} />
              <Text style={Styles.LoadingText}>Please Wait...</Text>
            </View>
            :
            <View style={Styles.textEmptyView}>
              <Icon
                name='commenting'
                size={responsiveFontSize(9)}
                color={colors.colorVariables.redLight1}
              />
              <Gap height={3} />
              <Text style={Styles.textEmpty}>Sorry, You don't have notifications</Text>
            </View>
          }
        </View>
        :
        <View>
          <Gap height={1} />
          <FlatList
            data={dataNotifications}
            keyExtractor={(v, idx) => idx.toString()}
            renderItem={({ item }) => (
              <ListItem
                onPress={() => setTimeout(() =>
                  navigation.navigate('NotificationDetailPage', { data: item }), 200)}
                rippleColor='rgba(200, 200, 200, 0.8)'
                onLongPress={() => OnLongPress(item.id)}
                styleWrapper={{ paddingHorizontal: 0, paddingVertical: 10 }}>
                <View style={Styles.itemView}>
                  <View style={Styles.itemViewIconWrapp}>
                    <View style={Styles.itemViewIcon}>
                      <Icon
                        // name='envelope-o'
                        name={item.icon}
                        size={responsiveFontSize(3)}
                        color='#5E8BFF'
                      />
                    </View>
                  </View>
                  <View style={Styles.itemViewDataWrapp}>
                    <View style={Styles.itemViewData}>
                      <View>
                        <Text style={Styles.textTitle}>{item.title}</Text>
                        <Text style={Styles.textBody}>{bodyFormat(item.subject)}</Text>
                      </View>
                      <View style={Styles.itemTimeWrapp}>
                        <Text style={[Styles.textBody, Styles.textTime]}>{
                          new Date(item.createdAt).getUTCDate() > new Date().getUTCDate() ?
                            new Date().getUTCDate() === new Date(item.createdAt).getUTCDate() + 1 ?
                              'Yesterday' : moment(item.createdAt).format('DD/MM/YYYY') : moment(item.createdAt).format('HH:mm')
                        }</Text>
                        {item.status_read === 0 && <View style={Styles.badgeNotif}></View>}
                      </View>
                    </View>
                    <View style={Styles.separator}></View>
                  </View>
                </View>
              </ListItem>
            )}
          />
        </View>
      }
      <Alert
        show={showAlert.show}
        type={showAlert.type}
        title={showAlert.title}
        message={showAlert.msg}
        showConfirmButton
        showCancelButton={showAlert.type === 'warning'}
        confirmText='OK'
        onConfirmPressed={() => {
          if (showAlert.type === 'warning') onDeleteNotif(showAlert.data);
          else setShowAlert(v => ({
            show: false, data: false, msg: '', type: 'success', title: ''
          }));
        }}
        onCancelPressed={() => setShowAlert(v => ({
          show: false, data: false, msg: '', type: 'success', title: ''
        }))}
      />
    </SafeAreaView>
  )
}, compare)

const mapStateToProps = state => ({
  dataNotification: state.NotificationReducer.dataNotification
})

export default connect(mapStateToProps)(NotificationPage);

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorVariables.white
  },

  //Style Render Item
  itemView: {
    flexDirection: 'row',
  },
  itemViewIconWrapp: {
    paddingLeft: 15,
    alignSelf: 'stretch'
  },
  itemViewIcon: {
    backgroundColor: '#CCDDFF',
    width: responsiveFontSize(3) + 18,
    height: responsiveFontSize(3) + 18,
    borderRadius: (responsiveFontSize(3) + 18) / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemViewDataWrapp: {
    flex: 1,
    marginLeft: 10,
  },
  separator: {
    height: 0.9,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'relative',
    bottom: -10
  },
  itemViewData: {
    flexDirection: 'row',
    marginRight: 10,
    flex: 1,
    justifyContent: 'space-between'
  },
  textTitle: {
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(2)
  },
  textBody: {
    fontFamily: customFont.secondary[600],
    fontSize: responsiveFontSize(1.8),
    color: 'rgba(0, 0, 0, 0.5)'
  },
  textTime: {
    fontFamily: customFont.secondary[700],
    fontSize: responsiveFontSize(1.5),
  },
  itemTimeWrapp: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },
  badgeNotif: {
    width: responsiveWidth(3),
    height: responsiveWidth(3),
    backgroundColor: colors.colorVariables.greenLightDark1,
    borderRadius: responsiveWidth(3) / 2
  },

  //List Empty Style Component
  emptyItemView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEmpty: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2),
  },
  textEmptyView: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  //Style Loading Indicator 
  LoadingSpinner: {
    width: responsiveHeight(13),
    height: responsiveHeight(13)
  },
  LoadingText: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2.5),
    marginTop: 8
  }
})
