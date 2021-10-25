import * as statusActions from '../actionTypes/status'

export const getStatus = () => async (dispatch, getStore, api) => {
  try {
    dispatch({ type: statusActions.GET_STATUS_REQUEST })

    const response = await api.get('/status')
    dispatch({ type: statusActions.GET_STATUS_SUCCESS, payload: response })
  } catch (error) {
    dispatch({ type: statusActions.GET_STATUS_FAILED })
  }
}
