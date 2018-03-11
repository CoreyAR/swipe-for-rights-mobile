import { createStore, applyMiddleware, compose } from 'redux'
import {
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import R from 'ramda'

// import { StartupTypes } from './StartupRedux'

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = []
  const enhancers = []

  /* ------------- Navigation Middleware ------------- */
  const navMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
  )
  
  middleware.push(navMiddleware)
  /* ------------- Saga Middleware ------------- */

  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware)

  /* ------------- Logger Middleware ------------- */

  const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE']
  if (__DEV__) {
    // the logger master switch
    // silence these saga-based messages
    // create the logger
    const logger = createLogger({
      predicate: (getState, { type }) => R.not(R.contains(type, SAGA_LOGGING_BLACKLIST)) //USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST))
    })
    middleware.push(logger)
  }

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware))

  /* ------------- AutoRehydrate Enhancer ------------- */

  const store = createStore(rootReducer, compose(...enhancers))

  // kick off root saga
  sagaMiddleware.run(rootSaga)

  return store
}
