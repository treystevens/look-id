import React, { Component } from 'react';

// Components
import Header from './components/Header';
import Boards from './components/Boards';
import Board from './components/Board';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Post from './components/Post';
import EditPost from './components/EditPost';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Settings from './components/Settings';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import UploadPost from './components/UploadPost';
import PrivateRoute from './components/PrivateRoute';
import Explore from './components/Explore';
import EditBoard from './components/EditBoard';
import NotFound from './components/NotFound';

// React Redux
import { connect } from 'react-redux';
import { addAuth } from './actions/actions';

// React Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Util functions
import { getData } from './util/serverFetch';


class App extends Component{

  constructor(props){
    super(props);

  }

  componentDidMount(){

    const serverResponse = getData('/auth');
    
    serverResponse
    .then( response => response.json())
    .then((user) => {

      if(user.isAuth){

        this.props.dispatch(addAuth(user.user));
      }        
    })
    .catch((err) => {
        console.log(err);
    });
  }


  render(){

    console.log(this.props);
    return(
      <Router basename='/'>
          <div className='container'>
            <Header />
            <Switch>
              <Route exact path='/' render={ (match) => <Explore key={match.match.path} isSearching={true} />} />
              <Route exact path='/explore' render={ (match) => <Explore endPoint='Explore' key={match.match.path}/>} />
              <Route exact path='/search' render={ (match) => <Explore endPoint='earch' key={match.match.path}/>} />
              <Route exact path='/search/:query' render={ (match) => <Explore endPoint='earch' key={match.match.path}/>} />
              <Route exact path='/feed' render={ (match) => <Explore endPoint='Feed' key={match.match.path}/>} />
              <Route exact path='/user/:user' render={ (match) => <Profile urlParams={match} key={match.match.params.user} />} />
              <Route exact path='/user/:user/:postid' render={ (match) => <Post urlParams={match}/>} />
              <Route exact path='/user/:user/:postid/edit' render={ (match) => <EditPost urlParams={match}/>} />
              <Route exact path='/boards/:boardid' render={ (match) => <Board urlParams={match}/>} />
              <Route exact path='/boards/:boardid/edit' render={ (match) => <EditBoard urlParams={match}/>} />
              <Route path='/boards' render={ () => <Boards pageName={'Boards'} />}/>
              <Route path='/signup' component={SignUp} />
              <Route path='/login' render={ () => <Login checkAuth={this.checkAuth} />}/>
              <Route path='/404' component={NotFound} />
              <PrivateRoute path='/profile/settings/change-password' component={ChangePassword} />
              <PrivateRoute path='/profile/settings/delete' component={DeleteAccount} />
              <PrivateRoute path='/profile/settings' component={Settings} />
              <PrivateRoute path='/profile/edit' component={EditProfile}/>
              <PrivateRoute path='/profile/upload' component={UploadPost} />
              <Route component={NotFound} />
            </Switch>
          </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username
    };
}


export default connect(mapStateToProps)(App);