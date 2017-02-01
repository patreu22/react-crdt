import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout.js';
import './css/index.css';

 import { Provider} from "react-redux"
 import store from "./store"

ReactDOM.render(
  <Provider store={store}><Layout/></Provider>, document.getElementById('root')
);
