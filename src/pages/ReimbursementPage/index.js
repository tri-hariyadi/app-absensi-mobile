import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
  Image,
  ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { useIsFocused } from '@react-navigation/native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { showMessage } from 'react-native-flash-message';
import { Gap, LoadingScreen, Alert } from '../../components';
import { colors, customFont, formatDate, normalizePrice } from '../../utils';
import jwt_decode from 'jwt-decode';
import { getReimbursement, getSaldoReimbursement, resetAllCommonReducer } from '../../store/actions/CommonAction';
import { deleteReimbursement } from '../../store/actions/TransactionAction';
import { getData } from '../../store/localStorage';
import { ILSpinner } from '../../assets';
import Styles from './style';

const ReimbursementPage = ({
  navigation,
  getReimbursement,
  getSaldoReimbursement,
  resetAllCommonReducer,
  getReimbursementLoading,
  getReimbursementData,
  getReimbursementError,
  getSaldoReimbursementData,
  getSaldoReimbursementError,
}) => {
  // --------------------------------- Modal Animation -----------------------------------------------
  const modalHeight = useRef(0);
  const [detailVisible, setDetailVisible] = useState({
    show: false, data: [], status: false, id: '',
    title: ['Reimbursement Name', 'Reimbursement Date', 'Payment Date', 'ReferenceID', 'Description', 'Location', 'Total Pay']
  });
  const panY = useRef(new Animated.Value(Dimensions.get('screen').height)).current;
  const resetPositionAnim = useRef(Animated.timing(panY, {
    toValue: 0, duration: 300, useNativeDriver: false
  })).current;
  const closeAnim = useRef(Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 500,
    useNativeDriver: false
  })).current;
  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([
        null, { dy: panY }
      ], { useNativeDriver: false }),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > (50 / 100) * modalHeight.current || gs.vy > 0.3) {
          return closeAnim.start(() => setDetailVisible(v => ({ ...v, show: !v.show, data: [] })));
        }
        return resetPositionAnim.start();
      },
    })
  ).current;

  useEffect(() => {
    if (detailVisible.show) {
      resetPositionAnim.start();
    }
  }, [detailVisible]);

  const dismissModal = () => closeAnim.start(() => setDetailVisible(v => ({ ...v, show: !v.show, data: [] })));
  // --------------------------------- End Modal Animation -----------------------------------------------

  const [showDatePick, setShowDatePick] = useState(false);
  const [dataReimburs, setDataReimburs] = useState([]);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showConfirmDel, setShowConfirmDel] = useState(false);
  const [showAlertDel, setShowAlertDel] = useState({
    show: false, type: 'success', msg: '', title: ''
  });
  let current = new Date();
  const dateRef = useRef(new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate())));
  const tokenRef = useRef();
  const newDataReimburs = useRef([]);
  const isFocused = useIsFocused();

  const onShowDetail = (item) => {
    resetPositionAnim.start();
    setDetailVisible(v => ({
      ...v,
      show: true,
      status: item.status,
      id: item._id,
      data: [
        [item.reimbursementName],
        [item.reimbursementDate ? formatDate(item.reimbursementDate) : '-'],
        [item.TransactionDate ? formatDate(item.TransactionDate) : '-'],
        [item.ReferenceID ? item.ReferenceID : '-'],
        [item.desc],
        [item.location],
        [item.totalPay ? normalizePrice(String(item.totalPay)) : '0'],
      ]
    }));
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const token = await getData('token');
      if (token) {
        tokenRef.current = jwt_decode(token.accessToken).idUser;
        const a = getReimbursement({
          userId: tokenRef.current,
          startDate: dateRef.current,
          endDate: dateRef.current
        });
        const b = getSaldoReimbursement({ userId: tokenRef.current });
        await Promise.all([a, b]);
        setLoadingPage(false);
      }
    });
    if (!isFocused) {
      dateRef.current = new Date(Date.UTC(current.getFullYear(),
        current.getMonth(), current.getDate()));
      setDataReimburs([]);
      newDataReimburs.current = [];
      resetAllCommonReducer();
      setLoadingPage(true);
    }
    return unsubscribe;
  }, [isFocused, navigation]);

  useEffect(() => {
    if (getReimbursementData && getReimbursementData.length > 0) {
      if (newDataReimburs.current.length === 0) {
        getReimbursementData.forEach((v, idx) => {
          if (idx < 3) newDataReimburs.current.push(v)
        });
        setDataReimburs(v => newDataReimburs.current)
      }
    }
  }, [getReimbursementData]);

  useEffect(() => {
    if (getSaldoReimbursementError) {
      showMessage({
        message:
          `Failed to retrieve Saldo Reimbursement because ${getSaldoReimbursementError.toLowerCase()}`,
        type: 'danger',
        duration: 2600
      });
    }
  }, [getSaldoReimbursementError]);

  const onLoadMore = () => {
    setLoadMoreLoading(true);
    if (newDataReimburs.current.length < getReimbursementData.length) {
      setTimeout(() => {
        const currentLength = newDataReimburs.current.length;
        getReimbursementData.forEach((v, idx) => {
          let maxLength = currentLength + 3;
          if (idx >= currentLength && idx < maxLength) {
            newDataReimburs.current.push(v);
          }
        });
        setDataReimburs(v => newDataReimburs.current);
        setLoadMoreLoading(false);
      }, 100);
    } else setLoadMoreLoading(false);
  }

  const onDeleteReimbursement = id => {
    setShowConfirmDel(false);
    closeAnim.start(() => setDetailVisible(v => ({ ...v, show: !v.show, data: [] })));
    setLoadingDelete(true);
    setTimeout(async () => {
      const result = await deleteReimbursement({ id });
      if (result) {
        setLoadingDelete(false);
        setShowAlertDel({
          show: true,
          type: 'success',
          msg: result,
          title: 'Success'
        });
        setDataReimburs([]);
        newDataReimburs.current = [];
        getReimbursement({
          userId: tokenRef.current,
          startDate: dateRef.current,
          endDate: dateRef.current
        });
        getSaldoReimbursement({ userId: tokenRef.current });
      } else {
        setLoadingDelete(false);
        setShowAlertDel({
          show: true,
          type: 'error',
          msg: 'Error deleting data reimbursement, please try again!',
          title: 'Error'
        });
      }
    }, 500);
  }

  return (
    <SafeAreaView style={Styles.container}>
      <View
        style={[Styles.content, { paddingVertical: 10 }]}>
        <View style={Styles.textGroup}>
          <Text style={[Styles.textGroup, { paddingVertical: 0, paddingHorizontal: 0 }]}>
            Reimbursement Overview
          </Text>
        </View>
      </View>
      <FlatList
        data={dataReimburs}
        keyExtractor={(v, idx) => idx.toString()}
        ListHeaderComponent={() => (
          <View>
            <View style={Styles.shapeView}>
            </View>
            <Gap height={1} />
            <View style={Styles.card}>
              <View style={Styles.cardBody}>
                <View style={Styles.groupCardItem}>
                  <Text style={Styles.textDesc}>Approved</Text>
                  <Gap height={0.8} />
                  <Text style={Styles.textMoney}>
                    {getSaldoReimbursementData ? normalizePrice(String(getSaldoReimbursementData.saldopaid)) : 'RP 0'}
                  </Text>
                </View>
                <View style={Styles.verticleLine}></View>
                <View style={Styles.groupCardItem}>
                  <Text style={Styles.textDesc}>Pending</Text>
                  <Gap height={0.8} />
                  <Text style={[Styles.textMoney, { color: colors.colorVariables.redLighten1 }]}>
                    {getSaldoReimbursementData ? normalizePrice(String(getSaldoReimbursementData.saldonotpaid)) : 'RP 0'}
                  </Text>
                </View>
              </View>
              <Gap height={2} />
              <View style={Styles.wrapperIncomePerMounth}>
                <Gap height={2} />
                <TouchableOpacity
                  activeOpacity={0.3}
                  onPress={() => navigation.navigate('ApplyReimbursementPage')}
                  style={Styles.btnAddReimbursement}>
                  <MaterialCommunityIcons
                    name='plus-circle'
                    size={responsiveFontSize(2.8)}
                    color={colors.colorVariables.blue1} />
                  <Gap width={1} />
                  <Text style={[Styles.textDetailCard, { color: colors.colorVariables.blue1 }]}>Apply Reimbursement</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Gap height={4} />
            <View style={[Styles.cardBody, Styles.contentWrapper, Styles.historyWrapper]}>
              <Text style={[Styles.textMoney, Styles.textHistory]}>Reimbursement History</Text>
              <TouchableOpacity
                onPress={() => setShowDatePick(true)}
                activeOpacity={0.5}
                style={Styles.filter}>
                <Text style={Styles.filterText}>Filter</Text>
                <MaterialCommunityIcons
                  name='filter-menu'
                  size={responsiveFontSize(2.5)}
                  color='#51D394' />
              </TouchableOpacity>
            </View>
            <Gap height={2} />
          </View>
        )}
        ItemSeparatorComponent={() => (<View style={Styles.separatorList} />)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onShowDetail(item)}
            activeOpacity={0.6}
            style={Styles.itemView(index, getReimbursementData.length)}>
            <View style={Styles.itemViewIcon}>
              <View style={Styles.itemViewIconWrapper}>
                <MaterialCommunityIcons
                  name='cash-multiple'
                  size={responsiveFontSize(3)}
                  color='#5E8BFF' />
              </View>
            </View>
            <View style={Styles.itemViewData}>
              <Text style={[Styles.itemViewTextUName, Styles.itemViewText]}>{item.reimbursementName}</Text>
              <Text style={[Styles.itemViewTextName, Styles.itemViewText]}>{item.location} . {formatDate(item.reimbursementDate, false)}</Text>
              <View style={Styles.itemViewStatus}>
                <Text style={Styles.itemViewBadge(item.status)}>
                  {item.status === 'accept' ? 'Approved by finance' : item.status === 'processing' ? 'Await for finance review' : 'Rejected by finance'}
                </Text>
                <Text style={Styles.itemViewTextUName}>{normalizePrice(String(item.totalPay))}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View>
            {getReimbursementLoading ?
              <View style={[Styles.contentWrapper, Styles.emptyItemView]}>
                <Image source={ILSpinner} style={Styles.LoadingSpinner} />
                <Text style={Styles.LoadingText}>Please Wait...</Text>
              </View>
              :
              <View style={[Styles.contentWrapper, Styles.emptyItemView]}>
                <MaterialCommunityIcons
                  name='database-remove'
                  size={responsiveFontSize(15)}
                  color={colors.colorVariables.danger} />
                <Text style={Styles.textEmpty}>
                  {getReimbursementError || `You don't have data reimbursement`}
                </Text>
              </View>
            }
          </View>
        )}
        ListFooterComponent={() => {
          if (getReimbursementData.length > 4) return (
            <View style={Styles.contentWrapper} activeOpacity={0.7}>
              <TouchableOpacity style={Styles.btnLoadMore} onPress={() => onLoadMore()}>
                <Text style={Styles.textBtnLoadMore}>Load More</Text>
                {loadMoreLoading && <Gap width={2} />}
                {loadMoreLoading && <ActivityIndicator size={18} color={colors.colorVariables.white} />}
              </TouchableOpacity>
            </View>
          )
          return null;
        }}
      />
      <Modal
        animated
        animationType='fade'
        visible={detailVisible.show}
        transparent
        onRequestClose={() => dismissModal()}>
        <View style={Styles.overlay}>
          <Animated.View {...panResponder.panHandlers} style={[Styles.ModalContainer, { top }]} onLayout={(e) => {
            modalHeight.current = e.nativeEvent.layout.height;
          }}>
            <View style={Styles.topLineModal}>
              <View style={Styles.lineModal}></View>
            </View>
            <View style={[Styles.headerDetail, Styles.contentWrapper]}>
              <Text style={Styles.textHeaderDetail}>Detail Reimbursement</Text>
              <Text style={Styles.itemViewBadge(detailVisible.status)}>
                {detailVisible.status === 'accept' ? 'Approved by finance' : detailVisible.status === 'processing' ? 'Await for finance review' : 'Rejected by finance'}
              </Text>
            </View>
            <View style={Styles.lineBottomModal} />
            <View style={Styles.contentWrapper}>
              <View>
                {detailVisible.data.map((item, idx) => (
                  <View key={`item-${idx}`} style={Styles.detailItemWrapper}>
                    <Text style={Styles.itemName}>{detailVisible.title[idx]}</Text>
                    <Text style={Styles.itemSeparator}>:</Text>
                    <Text style={Styles.itemValue}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Gap height={2} />
            <View style={Styles.lineBottomModal} />
            <View style={Styles.btnModalWrapper}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setShowConfirmDel(true)}
                style={[Styles.btnDone, Styles.btnConfirmAndDelete]}>
                <Text style={Styles.textBtnDone}>Confirm And Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={dismissModal}
                style={Styles.btnDone}>
                <Text style={Styles.textBtnDone}>Done</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={showDatePick}>
        <View style={Styles.modalContainer} >
          <View style={Styles.modalContent}>
            <Text style={Styles.modalTitle}>Filter By Custom Date</Text>
            <Gap height={1} />
            <DatePicker
              date={new Date(Date.UTC(current.getFullYear(),
                current.getMonth(), current.getDate()))}
              onDateChange={e => dateRef.current = e.toJSON().slice(0, 10)}
              mode='date'
              /*androidVariant='nativeAndroid'*/ />
            <Gap height={2} />
            <View>
              <Gap width={1} />
              <TouchableOpacity
                style={[Styles.modalButton, { backgroundColor: colors.colorVariables.blue1 }]}
                onPress={() => {
                  setShowDatePick(false);
                  setDataReimburs([]);
                  newDataReimburs.current = [];
                  getReimbursement({
                    userId: tokenRef.current,
                    startDate: dateRef.current,
                    endDate: dateRef.current
                  });
                }}>
                <Text style={Styles.modalTextButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <LoadingScreen show={loadingPage} />
      {showConfirmDel &&
        <Alert
          show={showConfirmDel}
          type='warning'
          title='Are You Sure ?'
          message='Are you sure you want to delete the data, data that has been deleted cannot be restored!'
          showConfirmButton
          showCancelButton
          confirmText='Delete'
          onConfirmPressed={() => onDeleteReimbursement(detailVisible.id)}
          onCancelPressed={() => setShowConfirmDel(false)}
        />
      }
      {showAlertDel &&
        <Alert
          show={showAlertDel.show}
          type={showAlertDel.type}
          title={showAlertDel.title}
          message={showAlertDel.msg}
          showConfirmButton
          confirmText='OK'
          onConfirmPressed={() => setShowAlertDel({
            show: false, type: 'success', msg: '', title: ''
          })}
        />
      }
      {loadingDelete &&
        <Alert
          show={loadingDelete}
          showProgress
          progressSize={35}
          progressColor={colors.colorVariables.blueDark}
          customView={<Text style={{ fontFamily: customFont.secondary[600] }}>Loading...</Text>}
          closeOnHardwareBackPress={false}
          closeOnTouchOutside={false}
        />
      }
    </SafeAreaView>
  )
}

const mapStateToProps = state => ({
  getReimbursementLoading: state.CommonReducer.getReimbursementLoading,
  getReimbursementData: state.CommonReducer.getReimbursementData,
  getReimbursementError: state.CommonReducer.getReimbursementError,

  getSaldoReimbursementLoading: state.CommonReducer.getSaldoReimbursementLoading,
  getSaldoReimbursementData: state.CommonReducer.getSaldoReimbursementData,
  getSaldoReimbursementError: state.CommonReducer.getSaldoReimbursementError,
});

export default connect(mapStateToProps, {
  getReimbursement,
  getSaldoReimbursement,
  resetAllCommonReducer
})(ReimbursementPage);
