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
import Notifications from './components/Notifications';

// React Redux
import { connect } from 'react-redux';
import { addAuth } from './actions/actions';

// React Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Util functions
import { getData } from './util/serverFetch';
import MBHeader from './components/MBHeader';



class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      isMobile: false
    };

  }


  componentDidMount(){


    // Check if mobile
    const isMobile = window.matchMedia("only screen and (max-width: 768px)");
    
    if (isMobile.matches) {
      this.setState({
        isMobile: true
      });
    }


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
    console.log(this.props)

    const { isMobile } = this.state;

    const header = isMobile ?  <MBHeader /> : <Header />

    return(
      <Router basename='/'>
          <div>
            {header}
            <Switch>
              <Route exact path='/' render={ (match) => <Explore key={match.match.path} endPoint='Explore'/>} />
              <Route path='/search' render={ (match) => <Explore key={match.match.path} urlParams={match} isSearching={true}/>} />
              <Route exact path='/feed' render={ (match) => <Explore endPoint='Feed' key={match.match.path}/>} />
              <Route exact path='/user/:user' render={ (match) => <Profile urlParams={match} key={match.match.params.user} />} />
              <Route exact path='/user/:user/:postid' render={ (match) => <Post urlParams={match}/>} />
              <Route exact path='/user/:user/:postid/edit' render={ (match) => <EditPost urlParams={match}/>} />
              <Route exact path='/boards/:boardid' render={ (match) => <Board urlParams={match}/>} />
              <Route exact path='/boards/:boardid/edit' render={ (match) => <EditBoard urlParams={match}/>} />
              <Route path='/boards' render={ () => <Boards pageName={'Boards'} />}/>
              <Route path='/signup' component={SignUp} />
              <Route path='/login' component={Login} />
              <Route path='/404' component={NotFound} />
              <PrivateRoute path='/profile/settings/change-password' component={ChangePassword} />
              <PrivateRoute path='/profile/settings/delete' component={DeleteAccount} />
              <PrivateRoute path='/profile/settings' component={Settings} />
              <PrivateRoute path='/profile/edit' component={EditProfile}/>
              <PrivateRoute path='/profile/upload' component={UploadPost} />
              <PrivateRoute path='/profile/notifications' component={Notifications} />
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