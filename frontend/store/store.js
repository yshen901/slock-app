import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import RootReducer from '../reducers/root_reducer';

const configureStore = (preloadedState = {}) => {
  let production = true;

  if (production)
    return createStore(RootReducer, preloadedState, applyMiddleware(thunk))
  return createStore(RootReducer, preloadedState, applyMiddleware(thunk, logger)) 
};

export default configureStore;