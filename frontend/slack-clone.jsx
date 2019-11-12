import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root'

import { logoutWorkspace } from './actions/workspace_actions';

import configureStore from './store/store'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  let store;

  if (window.currentUser) {
    let preloadedState = {
      entities: {
        users: { 
          [window.currentUser.id]: window.currentUser 
        },
        workspaces: window.currentWorkspaces
      },
      session: {
        user_id: window.currentUser.id,
        workspace_id: parseInt(Object.keys(window.currentWorkspaces)[0]),
        user_channels: [],
      },
      errors: {
        session: []
      }
    }
    store = configureStore(preloadedState);
  } else {
    store = configureStore();
  }
  delete window.currentUser;
  delete window.currentWorkspaces;

  loadWindowFuncs(store);

  ReactDOM.render(<Root store={store}/>, root)
});

const loadWindowFuncs = (store) => {
  window.getState = store.getState;
  window.dispatch = store.dispatch;

  window.logoutWorkspace = logoutWorkspace;
}