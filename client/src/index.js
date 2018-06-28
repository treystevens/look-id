import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

/* jshint ignore:start */

const intialState = {
    isAuth: false,
    notification: '',
    username: '',
    userID: ''
};


function reducer(state = intialState, action) {
    switch(action.type){
        case 'AUTHENTICATE':
        return {
            isAuth: true,
            username: action.user,
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


const store = createStore(reducer, applyMiddleware(thunk));






ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,

    document.getElementById('root')
    );


/* jshint ignore:end */