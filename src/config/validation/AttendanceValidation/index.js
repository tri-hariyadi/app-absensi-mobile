const AttendanceValidation = values => {
  const errors = {};

  if (!values.password || !values) errors.password = 'Please enter password';

  return errors;
}

export default AttendanceValidation;
