const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const LoginValidation = values => {
  const errors = {};

  if (!values.email) errors.email = 'Please enter email';
  else if (values.email && !emailRegex.test(values.email))
    errors.email = 'Email is not valid, please enter correct email';

  if (!values.password) errors.password = 'Please enter password';

  return errors;
}

export default LoginValidation;