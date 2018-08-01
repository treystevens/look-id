import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


const intialState = {
    isAuth: false,
    notifications: 0,
    username: '',
};


function reducer(state = intialState, action) {

    switch(action.type){
        case 'AUTHENTICATE':
        return {
            ...state,
            isAuth: true,
            username: action.user,
        };
        case 'LOGOUT':
        return {
            isAuth: false
        }
        case 'CHECK_NOTIFICATION':
        return {
            ...state,
            notifications: state.notifications + 1
        };
        default:
            return state;
    }
}


const store = createStore(reducer);


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,

    document.getElementById('root')
    );
