import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


const intialState = {
    isAuth: false,
    notification: '',
    username: '',
    userID: ''
};

// let intialS = {
//     isAuth: false,
//     notification: '',
//     user: {
//         username: '',
//         user_id: ''
//     }
// };

// case 'USERNAME':
//         return {
//             username: {
//                 username: action.user,
//                 userId: action.id
//             }
//         };

function reducer(state = intialState, action) {
    // console.log(action, `this is the action`)
    // console.log(action.text, `action type text`)
    // console.log(state,` this is the state inside the reducer`)
    switch(action.type){
        case 'AUTHENTICATE':
        return {
            isAuth: true,
            username: action.user,
            userID: action.userID
        };
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

// import registerServiceWorker from './registerServiceWorker';

/* jshint ignore:start */


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,

    document.getElementById('root')
    );
// registerServiceWorker();


// Code here will be ignored by JSHint.
/* jshint ignore:end */