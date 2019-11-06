import { combineReducers } from 'redux';
import EntitiesReducer from './entities/entities_reducer';
import SessionReducer from './session_reducer';
import ErrorsReducer from './errors/errors_reducer';

// TODO: ERRORS REDUCER + FLASHING ERRORS
const RootReducer = combineReducers({
  entities: EntitiesReducer,
  session: SessionReducer,
  errors: ErrorsReducer,
});

export default RootReducer;