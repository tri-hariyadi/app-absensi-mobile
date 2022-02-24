import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { connect } from 'react-redux';
import { Gap } from '../../components';
import { colors } from '../../utils';
import Styles from './style';

import { getAttendanceTag } from '../../store/actions/CommonAction';

const RenderLoading = () => {
  return (
    <View>
      <View style={Styles.loadingContainer}>
        <ActivityIndicator size={28} color={colors.colorVariables.blue1} />
        <Text style={[Styles.rowText, { paddingHorizontal: 10 }]}>Loading...</Text>
      </View>
      <Gap height={4} />
    </View>
  );
}

const mapStateToProps = state => ({
  getAttendanceTagLoading: state.CommonReducer.getAttendanceTagLoading,
  getAttendanceTagData: state.CommonReducer.getAttendanceTagData,
  getAttendanceTagError: state.CommonReducer.getAttendanceTagError,
});

const AttendenceTag = ({
  modalShow,
  dismiss,
  onDismiss,
  onRequestClose,
  noOptionMessages,
  getAttendanceTag,
  getAttendanceTagLoading,
  getAttendanceTagData,
  getAttendanceTagError
}) => {
  const [value, onChangeText] = useState('');
  const [dataOptions, setDataOptions] = useState([]);

  useEffect(() => {
    getAttendanceTag();
  }, []);

  useEffect(() => {
    if (getAttendanceTagData && getAttendanceTagData.length > 0)
      setDataOptions(getAttendanceTagData);
  }, [getAttendanceTagData]);

  const onChangeSearchBox = (text, data) => {
    if (data && data.length > 0) {
      const itemData = data.filter(v => {
        console.log(v.label.toLowerCase().indexOf(text.toLowerCase()));
        if (v.label.toLowerCase().indexOf(text.toLowerCase()) > -1)
          return v;
        return null;
      });
      setDataOptions(itemData);
    }
  }

  const RenderDropdown = () => {
    return (
      <FlatList
        data={dataOptions}
        keyExtractor={(item, idx) => idx.toString()}
        style={{ width: '100%' }}
        automaticallyAdjustContentInsets={false}
        renderItem={({ item }) =>
          <TouchableOpacity
            style={{ backgroundColor: 'black' }}
            onPress={() => {
              onDismiss(item);
              dismiss();
            }}>
            <Text style={Styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        }
        ListFooterComponent={() =>
          <Gap height={3.5} />
        }
      />
    );
  }

  const NoOptionMessage = () => {
    return (
      <View>
        <Text style={[Styles.rowText, { textAlign: 'center' }]}>
          {noOptionMessages ? noOptionMessages : getAttendanceTagError ? getAttendanceTagError : 'No Options'}
        </Text>
        <Gap height={3.5} />
      </View>
    )
  }

  return (
    <View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalShow}
        onRequestClose={onRequestClose}>
        <TouchableWithoutFeedback
          accessible={false}
          disabled={!modalShow}
          onPress={dismiss}>
          <View style={Styles.modal}>
            <View
              style={Styles.modalContent}>
              <View>
                <Gap height={3.5} />
                <Text style={Styles.modalTitle}>Select Attendance Tag</Text>
                <Gap height={3} />
                <View style={Styles.wrapperBoxSearch}>
                  <Icon
                    name='search'
                    size={responsiveFontSize(2.5)}
                    color={colors.colorVariables.black}
                  />
                  <Gap width={1} />
                  <TextInput
                    onChangeText={text => {
                      onChangeText(text);
                      onChangeSearchBox(text, getAttendanceTagData);
                    }}
                    value={value}
                    placeholder='Search'
                    blurOnSubmit={true}
                    style={{ width: '100%', paddingVertical: 5 }}
                  />
                </View>
                <Gap height={2} />
              </View>
              {dataOptions && dataOptions.length > 0 ?
                RenderDropdown(dataOptions) :
                getAttendanceTagLoading ? RenderLoading() : NoOptionMessage()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default connect(mapStateToProps, { getAttendanceTag })(AttendenceTag);
