import * as type from '../types';

const initialState = {
  getAbsentsLoading: false,
  getAbsentsData: false,
  getAbsentsError: false,

  getAbsentByIdLoading: false,
  getAbsentByIdData: false,
  getAbsentByIdError: false,

  getLatestAbsentsLoading: false,
  getLatestAbsentsData: false,
  getLatestAbsentsError: false,

  getAttendanceTagLoading: false,
  getAttendanceTagData: false,
  getAttendanceTagError: false,

  getSaldoKasLoading: false,
  getSaldoKasData: false,
  getSaldoKasError: false,

  getKasTransactionLoading: false,
  getKasTransactionData: false,
  getKasTransactionError: false,

  getUserByIdLoading: false,
  getUserByIdData: false,
  getUserByIdError: false,

  getReimbursementLoading: false,
  getReimbursementData: [],
  getReimbursementError: false,

  getSaldoReimbursementLoading: false,
  getSaldoReimbursementData: false,
  getSaldoReimbursementError: false,

  getTypeOffWorkLoading: false,
  getTypeOffWorkData: false,
  getTypeOffWorkError: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case type.RESET_ALL_COMMON_REDUCER:
      return {
        ...initialState
      }
    case type.GET_ABSENTS:
      return {
        ...state,
        getAbsentsLoading: action.payload.loading,
        getAbsentsData: action.payload.data,
        getAbsentsError: action.payload.errorMessage
      }
    case type.GET_LATEST_ABSENTS:
      return {
        ...state,
        getLatestAbsentsLoading: action.payload.loading,
        getLatestAbsentsData: action.payload.data,
        getLatestAbsentsError: action.payload.errorMessage,
      }
    case type.GET_ABSENT_BY_ID:
      return {
        ...state,
        getAbsentByIdLoading: action.payload.loading,
        getAbsentByIdData: action.payload.data,
        getAbsentByIdError: action.payload.errorMessage,
      }
    case type.GET_ATTENDANCE_TAG:
      return {
        ...state,
        getAttendanceTagLoading: action.payload.loading,
        getAttendanceTagData: action.payload.data,
        getAttendanceTagError: action.payload.errorMessage,
      }
    case type.GET_SALDO_KAS:
      return {
        ...state,
        getSaldoKasLoading: action.payload.loading,
        getSaldoKasData: action.payload.data,
        getSaldoKasError: action.payload.errorMessage,
      }
    case type.GET_KAS_TRANSACTION:
      return {
        ...state,
        getKasTransactionLoading: action.payload.loading,
        getKasTransactionData: action.payload.data,
        getKasTransactionError: action.payload.errorMessage,
      }
    case type.GET_USER_BY_ID:
      return {
        ...state,
        getUserByIdLoading: action.payload.loading,
        getUserByIdData: action.payload.data,
        getUserByIdError: action.payload.errorMessage,
      }
    case type.GET_REIMBURSEMENT:
      return {
        ...state,
        getReimbursementLoading: action.payload.loading,
        getReimbursementData: action.payload.data || [],
        getReimbursementError: action.payload.errorMessage,
      }
    case type.GET_SALDO_REIMBURSEMENT:
      return {
        ...state,
        getSaldoReimbursementLoading: action.payload.loading,
        getSaldoReimbursementData: action.payload.data,
        getSaldoReimbursementError: action.payload.errorMessage,
      }
    case type.GET_TYPE_OFF_WORK:
      return {
        ...state,
        getTypeOffWorkLoading: action.payload.loading,
        getTypeOffWorkData: action.payload.data,
        getTypeOffWorkError: action.payload.errorMessage,
      }
    default:
      return state;
  }
}
