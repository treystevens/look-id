import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import './styles/test.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
// import ItemSearch from './components/ItemSearch';
import Stream from './components/Stream';
import Boards from './components/Boards';
import Register from './components/Register';
import Login from './components/Login';
import Post from './components/Post';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import UploadPost from './components/UploadPost';
import AccountHead from './components/AccountHead';



// import { createStore } from 'redux';

// const store = createStore();



/* jshint ignore:start */


class App extends Component{

  constructor(props){
    super(props);
    // this.state = {
    //   username: '',
    //   postid: '',
    //   isAuth: false
    // }

    // this.checkAuth = this.checkAuth.bind(this)
  }

  // checkAuth(auth){
  //   if(auth){
  //     this.setState({
  //       isAuth: true
  //     })
  //   }
  // }

  componentDidMount(){
    fetch('/auth',{
        method: 'GET'
    })
    .then((res) => {
        console.log(res)
        return res.json()
    })
    .then((user) => {
        console.log(user, `app fetch to /`)
    })
    .catch((err) => {
        console.log(err)
    })
    }

  // componentDidUpdate(){
  //   console.log(this.state.isAuth)
  // }

  // <Provider store={store}>
  // </Provider>

  render(){
    return(
      <Router>
          <div className="container">
            <Header />
            {/* <Route exact={true} path="/explore" component={Stream} /> */}
            <Route path="/explore" render={ () => <Stream sourceFetch='explore' pageName={'Explore'}/>}/>
            <Route path="/feed" render={ () => <Stream sourceFetch='feed' pageName={'Feed'} />}/>
            <Route exact path="/user/:user" render={ (match) => <Stream sourceFetch='userProfile'urlParams={match}/>}/>
            <Route exact path="/user/:user/:postid" render={ (match) => <Post urlParams={match}/>}/>
            {/* <Route path="/user/:user/:postid" render={ (match) => <Post sourceFetch='post' urlParams={match}/>}/> */}
            <Route exact path="/user/:user/boards/:boardid" render={ () => <Stream sourceFetch='boards'/>} />
            <Route path="/boards" render={ () => <Boards pageName={'Boards'} />}/>
            <Route path="/signup" component={Register} />
            <Route path="/login" render={ () => <Login checkAuth={this.checkAuth} />}/>
            <Route exact path="/profile" render={ (match) => <Profile urlParams={match}/>}/>
            <Route exact path="/profile/edit" component={EditProfile} />
            <Route exact path="/profile/settings" component={Settings} />
            <Route exact path="/profile/settings/change-password" component={ChangePassword} />
            <Route exact path="/profile/settings/delete" component={DeleteAccount} />
            <Route exact path="/profile/upload" component={UploadPost} />
          </div>
      </Router>
    );
  }
}


export default App;


// Code here will be ignored by JSHint.
/* jshint ignore:end */