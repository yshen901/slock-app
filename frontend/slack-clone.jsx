import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import * as SessionAPI from './util/session_api_util';

const Root = () => (
  <div id="root-component">
    <App />
  </div>
);

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  loadWindowFuncs();

  ReactDOM.render(<Root />, root)
});

const loadWindowFuncs = () => {
  window.signup = SessionAPI.signup;
  window.login = SessionAPI.login;
  window.logout = SessionAPI.logout;
}