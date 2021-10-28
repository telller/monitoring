import * as statusActions from '../actionTypes/status'

const initialState = {
  statusFetching: false,
  status: [],
  statisticFetching: false,
  statistic: {},
}

const actions = {
  [statusActions.GET_STATUS_SUCCESS]: ({ payload: status }) => ({
    statusFetching: false,
    status,
  }),
  [statusActions.GET_STATUS_REQUEST]: () => ({ statusFetching: true }),
  [statusActions.GET_STATUS_FAILED]: () => ({ statusFetching: false }),

  [statusActions.GET_STATISTIC_SUCCESS]: ({ payload: statistic }) => ({
    statisticFetching: false,
    statistic,
  }),
  [statusActions.GET_STATISTIC_REQUEST]: () => ({ statisticFetching: true }),
  [statusActions.GET_STATISTIC_FAILED]: () => ({ statisticFetching: false }),
}

export default (state = initialState, action) => {
  return actions[action.type]
    ? { ...state, ...actions[action.type](action) }
    : state
}
