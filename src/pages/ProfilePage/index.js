import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonActions } from '@react-navigation/native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useIsFocused } from '@react-navigation/native';
import { ILNullPhoto } from '../../assets';
import { Gap, Alert } from '../../components';
import { colors, compare } from '../../utils';
import { useDispatch, connect } from 'react-redux';
import { userLogout, resetAllAuthReducer } from '../../store/actions/AuthAction';
import { updatePhotoProfile } from '../../store/actions/TransactionAction';
import { getUserById } from '../../store/actions/CommonAction';
import { getData, removeData } from '../../store/localStorage';
import jwt_decode from 'jwt-decode';
import SQLiteData from '../../store/SQLiteData';
import Styles from './style';

const gridMenu = [
  { id: 1, icon: 'notifications-none', title: 'Notification', /*onPressed: 'showModal'*/ action: 'notif' },
  { id: 2, icon: 'person-outline', title: 'Change Profile', page: 'ChangeProfilePage' },
  { id: 3, icon: 'assignment', title: 'Report', action: 'report' },
  { id: 4, icon: 'lock-open', title: 'Change\nPassword', action: 'changepassword' },
  { id: 5, icon: 'alarm', title: 'Reminder\nClock In / Out', action: 'reminder' },
  { id: 6, icon: 'exit-to-app', title: 'Logout', action: 'logout' },
];

const ProfilePage = React.memo(({
  navigation,
  getUserById,
  getUserByIdData,
  dataNotification
}) => {
  const ref = React.useRef(null);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [tokenDecoded, setTokenDecoded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [imageUri, setImageUri] = useState(ILNullPhoto);
  const [loadingUpdatePhoto, setLoadingUpdatePhoto] = useState(false);
  const [notif, setNotif] = useState({ show: false, item: 0 });
  const dispatch = useDispatch();
  let options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  useEffect(() => {
    if (dataNotification) {
      let a = dataNotification.filter(v => v.status_read === 0);
      if (a.length > 0) setNotif({
        show: true,
        item: a.length
      });
      else setNotif({ show: false, item: 0 })
    }
  }, [dataNotification]);

  useEffect(() => {
    const getDataUser = async () => {
      const payload = await getData('token');
      setTokenDecoded(jwt_decode(payload.accessToken));
    }
    getDataUser();
    SQLiteData.SelectQuery();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      if (!getUserByIdData) getUserById({ id: tokenDecoded.idUser });
    });
    if (isFocused && getUserByIdData) setImageUri({ uri: getUserByIdData.image });
    return unsubscribe;
  }, [isFocused]);

  useEffect(() => {
    if (getUserByIdData) setImageUri({ uri: getUserByIdData.image });
  }, [getUserByIdData]);

  const getImage = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setLoadingUpdatePhoto(true);
        let result = await updatePhotoProfile(response.uri, tokenDecoded.idUser);
        if (result) {
          getUserById({ id: tokenDecoded.idUser });
          showMessage({
            message: result,
            type: 'success',
            duration: 2600
          });
        }
        else showMessage({
          message: 'Failed to update photo profile, please try again',
          type: 'danger',
          duration: 2600
        });
        setLoadingUpdatePhoto(false);
      }
    });
  };

  const onLogout = () => {
    dispatch(resetAllAuthReducer());
    dispatch(userLogout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginPage' }]
        })
      );
    }));
    removeData('token');
    setShowAlert(false);
  }

  const onItemGridPressed = async (action) => {
    switch (action) {
      case 'logout':
        setShowAlert(true);
        break;
      case 'report':
        navigation.navigate('ReportPage');
        break;
      case 'notif':
        navigation.navigate('NotificationPage');
        break;
      case 'changepassword':
        navigation.navigate('ChangePassword');
        break;
      case 'reminder':
        navigation.navigate('Reminder');
        break;

      default:
        break;
    }
  }

  return (
    <SafeAreaView style={Styles.container}>
      <FlatList
        data={gridMenu}
        numColumns={3}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() =>
          <View style={Styles.content}>
            <View style={Styles.profileSection}>
              {loadingUpdatePhoto && <View style={[Styles.imageProfile, { backgroundColor: colors.colorVariables.whiteSmoke2, alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator size={20} color={colors.colorVariables.purple1} />
                <Text style={{ fontSize: responsiveFontSize(1.5) }}>Loading...</Text>
              </View>}
              {!loadingUpdatePhoto && <View>
                <Image
                  source={imageUri}
                  onError={() => setImageUri(ILNullPhoto)}
                  style={Styles.imageProfile} />
                <TouchableOpacity style={Styles.iconAddPhotoWrapper} onPress={() => getImage()}>
                  <Icon
                    name={'add-a-photo'}
                    size={responsiveFontSize(2)}
                    color={colors.colorVariables.white}
                  />
                </TouchableOpacity>
              </View>}
              <Gap height={2} />
              <Text style={Styles.textName}>{tokenDecoded.username}</Text>
              <Gap height={1} />
              <Text style={Styles.textGroup}>{tokenDecoded.organisation}</Text>
              <Gap height={1} />
              <Text style={Styles.textGroup2}>{tokenDecoded.division}</Text>
              <Gap height={4} />
            </View>
          </View>
        }
        ListFooterComponent={() => <Gap height={4} />}
        renderItem={({ item }) =>
          <TouchableOpacity
            onPress={() => item.page ? navigation.navigate(item.page) : item.onPressed ? setModalVisible(true) : onItemGridPressed(item.action)}
            style={Styles.menuButton}>
            <View style={Styles.iconWrapper}>
              <Icon
                name={item.icon}
                size={responsiveFontSize(6)}
                color={colors.colorVariables.black3}
              />
              {item.title === 'Notification' && notif.show && <View style={Styles.badge}>
                <Text style={Styles.badgeItem}>{notif.item}</Text>
              </View>}
            </View>
            <Gap height={1} />
            <Text style={[Styles.textGroup2, { textTransform: 'capitalize' }]}>{item.title}</Text>
          </TouchableOpacity>
        }
      />
      <Alert
        show={showAlert}
        type='warning'
        title='Warning'
        message='Are you sure, you will logout ?'
        showConfirmButton
        showCancelButton
        confirmText='OK'
        onConfirmPressed={onLogout}
        onCancelPressed={() => setShowAlert(false)}
        onDismiss={() => setShowAlert(false)}
      />
    </SafeAreaView>
  )
}, compare)

const mapStateToProps = state => ({
  errorLogout: state.AuthReducer.errorLogout,
  getUserByIdData: state.CommonReducer.getUserByIdData,
  dataNotification: state.NotificationReducer.dataNotification
});

export default connect(mapStateToProps, { getUserById })(ProfilePage);
