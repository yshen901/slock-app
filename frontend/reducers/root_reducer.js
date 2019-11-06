import { combineReducers } from 'redux';
import EntitiesReducer from './entities_reducer';
import SessionReducer from './session_reducer';

// TODO: ERRORS REDUCER + FLASHING ERRORS
const RootReducer = combineReducers({
  entities: EntitiesReducer,
  session: SessionReducer
});

export default RootReducer;