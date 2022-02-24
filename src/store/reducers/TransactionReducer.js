import * as type from '../types';

const initialState = {
  absentInLoading: false,
  absentInData: false,
  absentInError: false,

  absentOutLoading: false,
  absentOutData: false,
  absentOutError: false,

  payKasLoading: false,
  payKasData: false,
  payKasError: false,

  absencePermissionLoading: false,
  absencePermissionData: false,
  absencePermissionError: false,

  updateProfileLoading: false,
  updateProfileData: false,
  updateProfileError: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case type.RESET_ALL_TRANSACTION_REDUCER:
      return {
        ...initialState
      }
    case type.ABSENT_IN:
      return {
        ...state,
        absentInLoading: action.payload.loading,
        absentInData: action.payload.data,
        absentInError: action.payload.errorMessage,
      }
    case type.ABSENT_OUT:
      return {
        ...state,
        absentOutLoading: action.payload.loading,
        absentOutData: action.payload.data,
        absentOutError: action.payload.errorMessage,
      }
    case type.PAYING_KAS:
      return {
        ...state,
        payKasLoading: action.payload.loading,
        payKasData: action.payload.data,
        payKasError: action.payload.errorMessage,
      }
    case type.SENT_ABSENCE_PERMISSION:
      return {
        ...state,
        absencePermissionLoading: action.payload.loading,
        absencePermissionData: action.payload.data,
        absencePermissionError: action.payload.errorMessage,
      }
    case type.UPDATE_PROFILE:
      return {
        ...state,
        updateProfileLoading: action.payload.loading,
        updateProfileData: action.payload.data,
        updateProfileError: action.payload.errorMessage,
      }

    default:
      return state;
  }
}
