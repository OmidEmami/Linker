import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import store from "./redux/store";
import axios from "axios";
axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <>
 <Provider store={store}>
    <App />
    <ToastContainer />
    </Provider>
</>
);

