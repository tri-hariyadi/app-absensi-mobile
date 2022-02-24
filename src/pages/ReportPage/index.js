import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { writeFile, ExternalStorageDirectoryPath } from 'react-native-fs';
import XLSX from 'xlsx';
import SendIntentAndroid from 'react-native-send-intent';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, Gap, ModalDatePicker, TextField, BottomModal, Alert } from '../../components';
import { colors, customFont, dateFormat, formatDate } from '../../utils';
import { FilterAttendance } from '../../config/validation';
import { getAbsensts, resetAllCommonReducer } from '../../store/actions/CommonAction';

import { ILNullPhoto, ILSpinner } from '../../assets';
import jwtDecode from 'jwt-decode';
import { getData } from '../../store/localStorage';
import Styles from './style';

const ReportPage = ({
  navigation,
  handleSubmit,
  formValues,
  getAbsensts,
  resetAllCommonReducer,
  getAbsentsLoading,
  getAbsentsData,
  getAbsentsError
}) => {
  const modalPickerRef = useRef();
  const modalDetailRef = useRef();
  const dataReportRef = useRef([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [detail, setDetail] = useState(false);
  const [dataReport, setDataReport] = useState([]);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [tokenDecoded, setTokenDecoded] = useState(false);
  const [showAlertExpExcel, setShowAlertExpExcel] = useState({
    show: false, data: false, msg: '', type: 'success', title: ''
  });

  useEffect(() => {
    const getDataUser = async () => {
      const token = await getData('token');
      if (token) setTokenDecoded(jwtDecode(token.accessToken));
    }
    getDataUser();

    return () => {
      resetAllCommonReducer();
    }
  }, []);

  useEffect(() => {
    if (getAbsentsData && getAbsentsData.length > 0) {
      if (dataReportRef.current.length < 1) {
        getAbsentsData.forEach((item, idx) => {
          if (idx < 5) dataReportRef.current.push(item);
        });
        setDataReport(dataReportRef.current);
      } else setDataReport(dataReportRef.current);
      setLoadingData(false);
    }
    if (!getAbsentsLoading && !getAbsentsData) setLoadingData(false);
  }, [getAbsentsData, getAbsentsLoading]);

  const onFilter = values => {
    setDataReport([]);
    setLoadingData(true);
    const payload = {
      ...values,
      userId: tokenDecoded.idUser,
    }
    if (values.status) payload.status = values.status;
    getAbsensts(payload);
  }

  const getLongTimeWork = (timeIn, timeOut) => {
    let timeWorkDiff = Math.floor((dateFormat(timeOut).time - dateFormat(timeIn).time) / (1000 * 60));
    let restWorkMin = timeWorkDiff % 60;
    if (Math.floor(timeWorkDiff / 60) < 1) return 'a few minutes';
    else return `${Math.floor(timeWorkDiff / 60)} H ${restWorkMin} m`;
  }

  const onLoadMore = () => {
    setLoadMoreLoading(true);
    if (dataReportRef.current.length < getAbsentsData.length) {
      setTimeout(() => {
        const currentLength = dataReportRef.current.length;
        const maxLength = currentLength + 5;
        getAbsentsData.forEach((v, idx) => {
          if (idx >= currentLength && idx < maxLength) {
            dataReportRef.current.push(v);
          }
        });
        setDataReport(v => dataReportRef.current);
        setLoadMoreLoading(false)
      }, 100);
    } else setLoadMoreLoading(false);
  }

  const exportToExcel = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Allow Absensi Mobile to access storage',
          message: 'Your app needs permission.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const data_absents = getAbsentsData.map(item => ({
          'NIK': item.userId.nik,
          'Nama': item.userId.username,
          'Divisi': item.userId.divisi,
          'Tanggal Masuk': item.status === '3' ? '-' : formatDate(item.dateWork, 'DDDD, MMMM DD'),
          'Jam Masuk': item.status === '3' ? '-' : moment(item.timeIn).utc().format('HH:mm'),
          'Jam Keluar': item.status === '3' ? '-' : moment(item.timeOut).utc().format('HH:mm'),
          'Lokasi Absen': item.location,
          'Attendance Tag': item.desc,
          'Status': item.status === '1' ? 'On Work' : item.status === '2' ? 'Selesai' : item.status === '3' ? 'Izin' : 'Tidak Hadir'
        }));
        console.log(data_absents);
        const ws = XLSX.utils.json_to_sheet([...data_absents], { header: Object.keys(data_absents[0]) });
        const wb = XLSX.utils.book_new();
        wb.Props = {
          Title: 'Excel Data Report Attendance',
          Subject: 'File',
          Author: 'User Absensi Mobile',
          CreatedDate: new Date()
        };
        wb.SheetNames.push('File Report Attendance');
        wb.Sheets['File Report Attendance'] = ws;

        const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
        const file_name = `/Report_Attendance_${new Date().getTime()}.xlsx`
        const file = ExternalStorageDirectoryPath + file_name;
        writeFile(file, wbout, 'ascii').then((r) => {
          setShowAlertExpExcel(v => ({
            show: true,
            data: file_name,
            msg: `Succeeded export data to excel, file will be save in /storage/emulated/0${file_name}, click OK to read file.`,
            type: 'success',
            title: 'Success'
          }))
        }).catch((e) => {
          setShowAlertExpExcel(v => ({
            show: true,
            data: file_name,
            msg: `Permission denied, open /storage/emulated/0${file_name}, please allow Absensi Mobile to access storage.`,
            type: 'error',
            title: 'Error'
          }))
        });
        return true;
      } else {
        console.log('Access storage permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  const showFileExcel = async fileName => {
    SendIntentAndroid.openFileChooser(
      {
        subject: 'File Report Attendance',
        fileUrl: `/storage/emulated/0${fileName}`,
        type: 'application/vnd.ms-excel',
      },
      'Open file with:'
    );
  }
  console.log(dataReport);

  return (
    <SafeAreaView style={Styles.container}>
      <Header
        onLayout={(e) => {
          console.log(e.nativeEvent.layout)
          if (headerHeight < 1) setHeaderHeight(e.nativeEvent.layout.height);
        }}
        styleContainer={{ position: 'absolute', zIndex: 999 }}
        title='Attendance Report'
        background={colors.colorVariables.purple1}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode='none'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ flexGrow: 1, paddingTop: headerHeight }}>
        <View style={[Styles.headerView, { height: headerHeight }]} />
        <View style={Styles.filterContainer}>
          <View style={Styles.filterWrapContainer}>
            <View style={Styles.filterDateContainer}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: customFont.secondary[400] }}>Start Date</Text>
                <Gap height={1} />
                <TouchableOpacity
                  style={Styles.filterDateInput}
                  onPress={() => {
                    modalPickerRef.current.name = 'startDate';
                    modalPickerRef.current.show();
                  }}>
                  <View style={Styles.contentDateWrapper}>
                    <Text style={Styles.valueInput(formValues.startDate)}>{(formValues.startDate &&
                      `${formValues.startDate.split('-')[2]}-${formValues.startDate.split('-')[1]}-${formValues.startDate.split('-')[0]}`) || 'dd-mm-yyyy'}
                    </Text>
                    <Gap width={3} />
                    <MaterialIcons
                      name='event'
                      size={responsiveFontSize(3)}
                      color={colors.colorVariables.black3}
                    />
                  </View>
                </TouchableOpacity>
                <Field name='startDate' component={TextField} styleInput={{ display: 'none' }} />
              </View>
              <Gap width={5} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: customFont.secondary[400] }}>End Date</Text>
                <Gap height={1} />
                <TouchableOpacity
                  style={Styles.filterDateInput}
                  onPress={() => {
                    modalPickerRef.current.name = 'endDate';
                    modalPickerRef.current.show();
                  }}>
                  <View style={Styles.contentDateWrapper}>
                    <Text style={Styles.valueInput(formValues.endDate)}>{(formValues.endDate &&
                      `${formValues.endDate.split('-')[2]}-${formValues.endDate.split('-')[1]}-${formValues.endDate.split('-')[0]}`) || 'dd-mm-yyyy'}
                    </Text>
                    <Gap width={3} />
                    <MaterialIcons
                      name='event'
                      size={responsiveFontSize(3)}
                      color={colors.colorVariables.black3}
                    />
                  </View>
                </TouchableOpacity>
                <Field name='endDate' component={TextField} styleInput={{ display: 'none' }} />
              </View>
            </View>
            <TouchableOpacity
              style={[Styles.btnLoadMore, { flexDirection: 'row', alignItems: 'center', marginTop: 10 }]}
              onPress={handleSubmit(onFilter)}>
              <MaterialIcons
                name='filter-alt'
                size={responsiveFontSize(2.5)}
                color={colors.colorVariables.white}
              />
              <Gap width={1} />
              <Text style={Styles.textLoadMore}>Filter</Text>
            </TouchableOpacity>
            <Gap height={0.4} />
          </View>
        </View>
        <Gap height={1.5} />
        {!getAbsentsLoading && dataReport.length > 0 && <TouchableOpacity
          onPress={exportToExcel}
          activeOpacity={0.5}
          style={Styles.btnExcel}>
          <Icon
            name='file-excel-outline'
            size={responsiveFontSize(2.5)}
            color={colors.colorVariables.white}
          />
          <Gap width={1} />
          <Text style={Styles.textLoadMore}>Export Excel</Text>
        </TouchableOpacity>}
        <Gap height={1.5} />
        {!getAbsentsLoading && dataReport.length > 0 && dataReport.map((item, idx) => (
          <View key={`listView-${idx}`}>
            {idx === 0 && <View style={[Styles.separatorList, { marginLeft: 0 }]} />}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setDetail(item);
                modalDetailRef.current.dismiss();
              }}
              style={Styles.itemView}>
              <View style={Styles.imgWrapp}>
                <Image source={ILNullPhoto} style={[Styles.imageList, { position: 'absolute', zIndex: -1 }]} />
                <Image source={{ uri: item.status === '1' ? item.imageIn : item.imageOut }} style={Styles.imageList} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={Styles.attWrapper}>
                  <View>
                    <Text>{dateFormat(item.dateWork, 'DDDD, MMMM DD')}</Text>
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
                  <View style={Styles.WrappTime}>
                    <Text style={[Styles.textAttendance]}>
                      <Text style={Styles.textAttType(1)}>In:{' '}</Text>{item.status === '3' ? '-' : moment(item.timeIn).utc().format('HH:mm')}
                    </Text>
                    <Gap height={0.5} />
                    <Text style={[[Styles.textAttendance, { textAlign: 'left' }]]}>
                      <Text style={Styles.textAttType(2)}>Out:{' '}</Text>{(item.status === '3' || item.status === '1') ? '-' : moment(item.timeOut).utc().format('HH:mm')}
                    </Text>
                  </View>
                </View>
                <View style={Styles.separatorList} />
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {loadingData ?
          <View style={Styles.emptyItemView}>
            <Image source={ILSpinner} style={Styles.LoadingSpinner} />
            <Text style={Styles.LoadingText}>Please Wait...</Text>
          </View>
          :
          dataReport.length < 1 ?
            <View style={Styles.emptyItemView}>
              <Icon
                name='database-remove'
                size={responsiveFontSize(15)}
                color={colors.colorVariables.danger} />
              <Text style={Styles.textEmpty}>
                {getAbsentsError && getAbsentsError.toLowerCase() !== 'data absents is not found' ?
                  getAbsentsError : `You don't have data report attendance`}
              </Text>
            </View>
            : null
        }
        {!loadingData && getAbsentsData && getAbsentsData.length > 5 &&
          <TouchableOpacity
            style={[Styles.btnLoadMore, { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginRight: responsiveWidth(3.5) }]}
            onPress={onLoadMore}>
            <Text style={Styles.textLoadMore}>Load More</Text>
            {loadMoreLoading && <Gap width={1} />}
            {loadMoreLoading && <ActivityIndicator size={15} color={colors.colorVariables.white} />}
          </TouchableOpacity>
        }
        <Gap height={2} />
      </ScrollView>
      <ModalDatePicker ref={modalPickerRef} form='filterReport' />
      <BottomModal ref={modalDetailRef} btnDone>
        <View>
          <View style={Styles.detailHeader}>
            <View style={{ height: '100%' }}>
              <Image source={ILNullPhoto} style={[Styles.imageList, { position: 'absolute', zIndex: -1 }]} />
              <Image source={{ uri: detail.status === '1' ? detail.imageIn : detail.imageOut }} style={Styles.imageList} />
            </View>
            <View style={Styles.detaiHeadWrappTxt}>
              <View style={Styles.nameWrapp}>
                <Text style={Styles.textName}>{detail && detail.userId.username}</Text>
                {detail.status === '2' &&
                  <Text style={Styles.badge('2')}>
                    Worked for {getLongTimeWork(detail.timeIn, detail.timeOut)}
                  </Text>
                }
                {detail.status === '1' && new Date(detail.timeIn).getUTCDate() !== new Date().getDate() &&
                  <Text style={Styles.badge('check')}>
                    You've missed leave attendance
                  </Text>
                }
                {detail.status === '3' &&
                  <Text style={Styles.badge('3')}>
                    Off Work
                  </Text>
                }
              </View>
              <Text style={Styles.textDivision}>{detail && detail.userId.divisi}</Text>
            </View>
          </View>
          <View style={Styles.lineBottomModal} />
          <View style={Styles.itemDetail}>
            <Text style={Styles.itemDetailName}>Work Date</Text>
            <Text style={Styles.itemDetailSeparator}>:</Text>
            <Text style={Styles.itemDetailValue}>{
              detail.status !== '3' ? formatDate(detail.dateWork, 'DDDD, MMMM DD') : '-'
            }</Text>
          </View>
          {detail.status === '3' && <View style={Styles.itemDetail}>
            <Text style={Styles.itemDetailName}>Type Off Work</Text>
            <Text style={Styles.itemDetailSeparator}>:</Text>
            <Text style={Styles.itemDetailValue}>{detail.typeOffWork ? detail.typeOffWork.name : '-'}</Text>
          </View>}
          {detail.status === '3' ?
            <View>
              <View style={Styles.itemDetail}>
                <Text style={Styles.itemDetailName}>Start date of work leave</Text>
                <Text style={Styles.itemDetailSeparator}>:</Text>
                <Text style={Styles.itemDetailValue}>{formatDate(detail.startOffWork, 'DDDD, MMMM DD')}</Text>
              </View>
              <View style={Styles.itemDetail}>
                <Text style={Styles.itemDetailName}>End date of work leave</Text>
                <Text style={Styles.itemDetailSeparator}>:</Text>
                <Text style={Styles.itemDetailValue}>{formatDate(detail.endOffWork, 'DDDD, MMMM DD')}</Text>
              </View>
            </View>
            :
            <View>
              <View style={Styles.itemDetail}>
                <Text style={Styles.itemDetailName}>Check-in time</Text>
                <Text style={Styles.itemDetailSeparator}>:</Text>
                <Text style={Styles.itemDetailValue}>{moment(detail.timeIn).utc().format('HH:mm')}</Text>
              </View>
              <View style={Styles.itemDetail}>
                <Text style={Styles.itemDetailName}>Check-out time</Text>
                <Text style={Styles.itemDetailSeparator}>:</Text>
                <Text style={Styles.itemDetailValue}>{detail.status === '1' ? '-' : moment(detail.timeOut).utc().format('HH:mm')}</Text>
              </View>
            </View>
          }
          <View style={Styles.itemDetail}>
            <Text style={Styles.itemDetailName}>Description</Text>
            <Text style={Styles.itemDetailSeparator}>:</Text>
            <Text style={Styles.itemDetailValue}>{detail.desc}</Text>
          </View>
          <View style={Styles.itemDetail}>
            <Text style={Styles.itemDetailName}>Location</Text>
            <Text style={Styles.itemDetailSeparator}>:</Text>
            <Text style={Styles.itemDetailValue}>{detail.location}</Text>
          </View>
        </View>
      </BottomModal>
      <Alert
        show={showAlertExpExcel.show}
        type={showAlertExpExcel.type}
        title={showAlertExpExcel.title}
        message={showAlertExpExcel.msg}
        showConfirmButton
        showCancelButton
        confirmText='OK'
        onConfirmPressed={() => showFileExcel(showAlertExpExcel.data)}
        onCancelPressed={() => setShowAlertExpExcel(v => ({
          show: false, data: false, msg: '', type: 'success', title: ''
        }))}
      />
    </SafeAreaView>
  )
}

const selector = formValueSelector('filterReport');
const mapStateToProps = state => ({
  formValues: selector(state, 'startDate', 'endDate'),
  getAbsentsLoading: state.CommonReducer.getAbsentsLoading,
  getAbsentsData: state.CommonReducer.getAbsentsData,
  getAbsentsError: state.CommonReducer.getAbsentsError,
});

export default reduxForm({
  form: 'filterReport',
  validate: FilterAttendance
})(connect(mapStateToProps, {
  getAbsensts,
  resetAllCommonReducer
})(ReportPage));
