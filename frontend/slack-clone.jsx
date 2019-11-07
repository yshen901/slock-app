import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root'

import {
  signup, 
  login, 
  logout 
} from './actions/session_actions';

import { 
  getWorkspace, 
  getWorkspaces 
} from './util/session_api_util';

import { 
  getChannels,
  getChannel,
  postChannel,
  deleteChannel
} from './util/workspace_api_util';

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
        workspaces: {
          [window.currentWorkspace.id]: window.currentWorkspace
        }
      },
      session: {
        user_id: window.currentUser.id,
        workspace_id: window.currentWorkspace.id
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
  delete window.currentWorkspace;

  loadWindowFuncs(store);

  ReactDOM.render(<Root store={store}/>, root)
});

const loadWindowFuncs = (store) => {
  window.signup = signup;
  window.login = login;
  window.logout = logout;

  window.getWorkspace = getWorkspace;
  window.getWorkspaces = getWorkspaces;

  window.getChannel = getChannel;
  window.getChannels = getChannels;
  window.postChannel = postChannel;
  window.deleteChannel = deleteChannel;

  window.getState = store.getState;
  window.dispatch = store.dispatch;
}