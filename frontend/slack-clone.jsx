import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root'

import { signup, login, logout } from './actions/session_actions';
import { getWorkspace } from './util/session_api_util';
import configureStore from './store/store'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  const store = configureStore();
  loadWindowFuncs(store);

  ReactDOM.render(<Root store={store}/>, root)
});

const loadWindowFuncs = (store) => {
  window.signup = signup;
  window.login = login;
  window.logout = logout;

  window.getWorkspace = getWorkspace;

  window.getState = store.getState;
  window.dispatch = store.dispatch;
}