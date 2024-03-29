import * as statusActions from '../actionTypes/status'
import dayjs from 'dayjs'

export const getStatus = dateRange => async (dispatch, getStore, api) => {
  try {
    dispatch({ type: statusActions.GET_STATUS_REQUEST })
    const from = dayjs(dateRange[0]).format()
    const to = dayjs(dateRange[1]).format()
    const response = await api.get(`/status?from=${from}&to=${to}`)
    dispatch({ type: statusActions.GET_STATUS_SUCCESS, payload: response })
  } catch (error) {
    dispatch({ type: statusActions.GET_STATUS_FAILED })
  }
}

export const getStatistic = dateRange => async (dispatch, getStore, api) => {
  try {
    dispatch({ type: statusActions.GET_STATISTIC_REQUEST })

    const from = dayjs(dateRange[0]).format()
    const to = dayjs(dateRange[1]).format()
    const response = await api.get(`/status/statistic?from=${from}&to=${to}`)
    dispatch({ type: statusActions.GET_STATISTIC_SUCCESS, payload: response })
  } catch (error) {
    dispatch({ type: statusActions.GET_STATISTIC_FAILED })
  }
}
