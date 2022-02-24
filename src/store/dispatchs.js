export const loadingDispatch = (dispatch, type) => dispatch({
  type,
  payload: {
    loading: true,
    data: false,
    errorMessage: false
  }
});

export const successDispatch = (dispatch, type, data) => dispatch({
  type,
  payload: {
    loading: false,
    data,
    errorMessage: false
  }
});

export const errorDispatch = (dispatch, type, error) => dispatch({
  type,
  payload: {
    loading: false,
    data: false,
    errorMessage: error
  }
});
