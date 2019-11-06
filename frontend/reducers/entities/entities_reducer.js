import { combineReducers } from 'redux';
import UserReducer from './user_reducer';
import WorkspaceReducer from './workspace_reducer';

const EntitiesReducer = combineReducers({
  users: UserReducer,
  workspaces: WorkspaceReducer
})

export default EntitiesReducer;