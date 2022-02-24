import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity
} from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { colors, customFont, compare } from '../../../utils';
import { DatePickerField, Gap } from '../../Common';

const ModalDatePicker = React.forwardRef(({
  form,
  name
}, ref) => {
  const [showModal, setShowModal] = useState(false);
  if (ref) ref.current = {
    ...ref.current,
    show: () => setShowModal(v => !v)
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={showModal}>
      <View style={Styles.modalContainer}>
        <View style={Styles.modalContent}>
          <Text style={Styles.modalTitle}>Enter Reimbursement Date</Text>
          <Gap height={1} />
          <DatePickerField form={form} name={ref.current.name} />
          <Gap height={2} />
          <View>
            <Gap width={1} />
            <TouchableOpacity
              style={[Styles.modalButton, { backgroundColor: colors.colorVariables.blue1 }]}
              onPress={() => setShowModal(false)}>
              <Text style={Styles.modalTextButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}, compare);

export default React.memo(ModalDatePicker, compare);

const Styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorVariables.black4
  },
  modalContent: {
    margin: 20,
    backgroundColor: colors.colorVariables.white,
    borderRadius: 12,
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(8),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 6,
    width: '85%'
  },
  modalTitle: {
    fontFamily: customFont.secondary[700],
    color: '#626262',
    fontSize: responsiveFontSize(2.3),
    textAlign: 'center'
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: responsiveWidth(4),
    elevation: 2,
    backgroundColor: colors.colorVariables.redLighten1
  },
  modalTextButton: {
    textAlign: 'center',
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.white,
    fontSize: responsiveFontSize(2)
  },
})
