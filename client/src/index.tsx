import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./styles/styles.scss"
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import 'react-toastify/dist/ReactToastify.css'

import store from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);