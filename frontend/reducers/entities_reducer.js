import { combineReducers } from 'redux';
import UserReducer from './user_reducer';

const EntitiesReducer = combineReducers({
  users: UserReducer
})

export default EntitiesReducer;