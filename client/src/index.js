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
    console.log(action)
    switch(action.type){
        case 'AUTHENTICATE':
        return {
            ...state,
            isAuth: true,
            username: action.user,
        };
        case 'LOGOUT':
        return {
            ...state,
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
        case 'UPDATE_AVATAR':
        return {
            ...state,
            myAvatar: action.updateAvatar
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