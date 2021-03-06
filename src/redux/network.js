// @flow
import { createReducer, createActions, Types as ReduxSauceTypes } from 'reduxsauce'
import { spread } from '../helpers'
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startCall: ['endpoint', 'args', 'successAction'],
  endCall: [],
  error: ['error']
})

export const NetworkTypes = Types
export default Creators


/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  error: undefined,
  fetching: false
}

/* ------------- Reducers ------------- */

const startCall = (state) => spread(state, { fetching: true })
const endCall = (state) => spread(state, { fetching: false})
const errorReducer = (state, {error}) => {
  let message = error && error.response ? error.response.data : undefined
  message = !message && error && error.message ? error.message : message
  return spread(state, {error: message})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.START_CALL]: startCall,
  [Types.END_CALL]: endCall,
  [ReduxSauceTypes.DEFAULT]: errorReducer,
})

/* ------------- Selectors ------------- */


