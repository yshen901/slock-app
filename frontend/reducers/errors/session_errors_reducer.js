import { 
  RECEIVE_USER,
  LOGOUT,
} from '../../actions/session_actions';

import {
  RECEIVE_ERRORS,
  CLEAR_ERRORS,
} from '../../actions/error_actions';

import { RECEIVE_WORKSPACE } from '../../actions/workspace_actions';

const SessionErrorsReducer = (state=[], action) => {
  Object.freeze(state);

  switch(action.type) {
    case RECEIVE_USER:
    case RECEIVE_WORKSPACE:
    case LOGOUT:
    case CLEAR_ERRORS:
      return [];
    case RECEIVE_ERRORS:
      return action.errors.responseJSON; //NOTE: Errors is an object, actual messages are mapped to responseJSON
    default:
      return state;
  }
}

export default SessionErrorsReducer;