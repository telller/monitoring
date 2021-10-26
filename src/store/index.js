import { createStore, applyMiddleware } from 'redux'
import api from 'services/baseService'
import reducers from './reducers'
import { useMemo } from 'react'
import thunk from 'redux-thunk'

let index

const initStore = initialState => {
  return createStore(
    reducers,
    initialState,
    applyMiddleware(thunk.withExtraArgument(api))
  )
}

const initializeStore = preloadedState => {
  let _store = index ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && index) {
    _store = initStore({ ...index.getState(), ...preloadedState })
    // Reset the current store
    index = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!index) index = _store

  return _store
}

const useStore = initialState => {
  return useMemo(() => initializeStore(initialState), [initialState])
}

export { useStore }
