const ChangePasswordValidation = values => {
  const errors = {};

  if (!values.currentPassword)
    errors.currentPassword = 'Current Password must be filled!';
  if (!values.newPassword)
    errors.newPassword = 'New Password must be filled!';
  if (!values.confirmNewPassword)
    errors.confirmNewPassword = 'Confirm New Password must be filled!';

  if (values.newPassword) {
    if (values.newPassword.length < 8)
      errors.newPassword = 'New Password length must be at least 8 characters!';
    if (!(/[A-Z]/.test(values.newPassword)) || !(/[a-z]/.test(values.newPassword)))
      errors.newPassword = 'New Password must contains lowercase and uppercase!';
    if (!(/[1-9]/.test(values.newPassword)))
      errors.newPassword = 'New Password must contains at least one number!';
  }

  if (values.newPassword && values.confirmNewPassword) {
    if (values.newPassword !== values.confirmNewPassword)
      errors.confirmNewPassword = 'Password confirmation is not matched!';
  }

  return errors;
}

export default ChangePasswordValidation;
