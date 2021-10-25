import * as statusActions from '../actionTypes/status'

const initialState = {
  statusFetching: false,
  status: [],
}

const actions = {
  [statusActions.GET_STATUS_SUCCESS]: ({ payload: status }) => ({
    statusFetching: false,
    status,
  }),
  [statusActions.GET_STATUS_REQUEST]: () => ({ statusFetching: true }),
  [statusActions.GET_STATUS_FAILED]: () => ({ statusFetching: false }),
}

export default (state = initialState, action) => {
  return actions[action.type]
    ? { ...state, ...actions[action.type](action) }
    : state
}
