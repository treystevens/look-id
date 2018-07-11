import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


/* jshint ignore:start */

const intialState = {
    isAuth: false,
    notification: '',
    username: '',
    myAvatar: ''
};


function reducer(state = intialState, action) {
    switch(action.type){
        case 'AUTHENTICATE':
        return {
            isAuth: true,
            username: action.user,
            myAvatar: action.myAvatar
        };
        case 'LOGOUT':
        return {
            isAuth: false
        }
        case 'COMMENT':
        return {
            notification: action.text
        };
        case 'LIKED':
        return {
            notification: action.text
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


/* jshint ignore:end */