const FilterAttendance = values => {
  const errors = {};

  if (!values.startDate) errors.startDate = 'Start Date must be filled!';
  if (!values.endDate) errors.endDate = 'End Date must be filled!';
  if (new Date(values.startDate) > new Date(values.endDate))
    errors.endDate = `End Date can't be less than Start Date`;

  return errors;
}

export default FilterAttendance;
