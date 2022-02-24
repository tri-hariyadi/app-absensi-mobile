const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const ProfileValidation = values => {
  const errors = {};

  if (!values.username) errors.username = 'Please enter full name';
  else if (values.username && values.username.length < 3)
    errors.username = 'Full name minimum 3 digits';

  if (!values.email) errors.email = 'Please enter email';
  else if (values.email && !emailRegex.test(values.email))
    errors.email = 'Email is not valid, please enter correct email';

  if (!values.phonenumber) errors.phonenumber = 'Please enter phone number';
  else if (values.phonenumber) {
    if (values.phonenumber.length < 9)
      errors.phonenumber = 'Phone number minimum 9 digits';
    else if (values.phonenumber.charAt(0) !== '0')
      errors.phonenumber = 'Phone number must start with 0';
  }

  if (!values.organisation) errors.organisation = 'Please enter Organization';

  if (!values.divisi) errors.divisi = 'Please enter Division';

  if (!values.class) errors.class = 'Please enter Class';

  if (!values.nim) errors.nim = 'Please enter NIM';

  if (!values.placeOfBirth) errors.placeOfBirth = 'Please enter place of birth';

  if (!values.dateOfBirth) errors.dateOfBirth = 'Please enter date of birth';
  else if (values.dateOfBirth) {
    if (new Date(values.dateOfBirth).getTime() >= new Date().getTime())
      errors.dateOfBirth = 'Date of birth must be less than today';
  }

  if (!values.gender) errors.gender = 'Please select gender';

  return errors;
}

export default ProfileValidation;
