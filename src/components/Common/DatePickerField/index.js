import React from 'react';
import DatePicker from 'react-native-date-picker';
import { useDispatch } from 'react-redux';
import { change } from 'redux-form';

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return false;
}

const DatePickerField = React.forwardRef(({ form, name }, ref) => {
  const dispatch = useDispatch();
  const currentDate = new Date();
  const updateField = (date) => dispatch(change(form, name, formatDate(date)));
  const formatDate = (date) => {
    let d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  return (
    <DatePicker
      innerRef={ref}
      date={currentDate}
      onDateChange={(date) => updateField(date)}
      mode="date"
    // androidVariant="nativeAndroid"
    />
  )
})

export default React.memo(DatePickerField, areEqual);
