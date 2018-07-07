import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore , combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

/* jshint ignore:start */

const intialState = {
    isAuth: false,
    notification: '',
    username: '',
    userID: '',
    avatar: ''
};


function reducer(state = intialState, action) {
    switch(action.type){
        case 'AUTHENTICATE':
        return {
            isAuth: true,
            username: action.user,
            avatar: action.avatar,
            userID: action.userID
        };
        case 'LOGOUT':
        return {
            isAuth: false
        }
        case 'USERNAME':
        return {
            userid: {
                username: action.user,
                userId: action.id
            }
        };
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