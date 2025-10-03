import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/root'

import { logoutWorkspace } from './actions/workspace_actions';

import configureStore from './store/store'

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement)

  console.log("HI")

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
        user_channels: {},
      },
      errors: {
        session: []
      }
    }
    store = configureStore(preloadedState);
    window.store = store;
  } else {
    store = configureStore();
    window.store = store;
  }
  delete window.currentUser;
  delete window.currentWorkspaces;

  loadWindowFuncs(store);

  root.render(<Root store={store}/>)
});

const loadWindowFuncs = (store) => {
  window.getState = store.getState;
  window.dispatch = store.dispatch;

  window.logoutWorkspace = logoutWorkspace;
}