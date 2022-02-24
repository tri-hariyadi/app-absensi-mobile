const ApplyReimburseValidation = values => {
  const errors = {};

  if (!values.reimbursementDate) errors.reimbursementDate = 'Please enter Reimbursement Date';
  if (!values.reimbursementName) errors.reimbursementName = 'Please enter Reimbursement Name';
  if (!values.desc) errors.desc = 'Please enter Deskription about Reimbursement';
  if (!values.total) errors.total = 'Please enter Total Reimbursement';

  return errors;
}

export default ApplyReimburseValidation;
