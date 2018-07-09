import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import './styles/test.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
// import ItemSearch from './components/ItemSearch';
import Stream from './components/Stream';
import Boards from './components/Boards';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Post from './components/Post';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import UploadPost from './components/UploadPost';
import PrivateRoute from './components/PrivateRoute';
import Explore from './components/Explore';
import { addAuth } from './actions/addAuth';
import { connect } from 'react-redux';


/* jshint ignore:start */


class App extends Component{

  constructor(props){
    super(props);

  }

  componentDidMount(){
    fetch('/auth',{
        method: 'GET',
        credentials: 'include'
    })
    .then( response => response.json())
    .then((user) => {

      if(user.isAuth){
        this.props.dispatch(addAuth(user.user));
      }        
    })
    .catch((err) => {
        console.log(err)
    })
  }


  render(){

  
    return(
      <Router basename='/'>
          <div className="container">
            <Header />
            {/* <Route exact={true} path="/explore" component={Stream} /> */}
            <Route exact path="/" render={ () => <Explore pageName={'Explore'}/>}/>
            <Route path="/feed" render={ () => <Stream sourceFetch='feed' pageName={'Feed'} />}/>
            <Route exact path="/user/:user" render={ (match) => <Profile urlParams={match}/>}/>
            <Route exact path="/user/:user/:postid" render={ (match) => <Post urlParams={match}/>}/>
            {/* <Route path="/user/:user/:postid" render={ (match) => <Post sourceFetch='post' urlParams={match}/>}/> */}
            <Route exact path="/user/:user/boards/:boardid" render={ () => <Stream sourceFetch='boards'/>} />
            <Route path="/boards" render={ () => <Boards pageName={'Boards'} />}/>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" render={ () => <Login checkAuth={this.checkAuth} />}/>
            <Switch>
              <PrivateRoute path="/profile/settings/change-password" component={ChangePassword} />
              <PrivateRoute path="/profile/settings/delete" component={DeleteAccount} />
              <PrivateRoute path="/profile/settings" component={Settings} />
              <PrivateRoute path="/profile/edit" component={EditProfile}/>
              <PrivateRoute path="/profile/upload" component={UploadPost} />
              {/* <PrivateRoute path="/profile" component={Profile}/> */}
              
            </Switch>
          </div>
      </Router>
    );
  }
}


function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
      userID: state.userID,
      avatar: state.avatar
    };
}


export default connect(mapStateToProps)(App);


// Code here will be ignored by JSHint.
/* jshint ignore:end */