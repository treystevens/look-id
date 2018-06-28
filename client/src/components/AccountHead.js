import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'; 
import Notifications from './Notifications';    
import { connect } from 'react-redux'                       

/* jshint ignore:start */

function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
      userID: state.userID
    };
}

class AccountHead extends Component{
    constructor(props){
        super(props)
        this.state = {
            shownContent: ''
        }

        this.unauthorized = this.unauthorized.bind(this);
        this.authorized = this.authorized.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this)
    }

    // make mobile with image instead of name?

    componentDidUpdate(){
        console.log(`updated`)
    }

    logoutHandler(evt){
        evt.preventDefault();

        fetch('/auth/logout', {
            method: 'GET',
            credentials: 'include' 

        })
        .then((response) => {
            console.log(response)
            
            return response.json()
        })
        .then((data) => {

            if(!data.isAuth){
                this.props.dispatch({type: 'LOGOUT'})
            }

            console.log(data)
        })
        .catch((err) => {
            console.log(err)
        })
        
    }


    authorized(){
        return(
          
                <ul className="testList">
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <li><NavLink to='/profile'>{this.props.username}</NavLink></li>
                    <Notifications />
                    </div>
                    <li><NavLink to='/profile/edit'>Edit Profile</NavLink></li>
                    <li><NavLink to='/profile/settings'>Settings</NavLink></li>
                    <li><a href='/auth/logout' onClick={this.logoutHandler}>Log Out</a></li>
                </ul>
                
             
        )
    }

    unauthorized(){
        return (
            
                
                <ul className="testList">
                    <li><NavLink to='/login'>Log in</NavLink></li>
                    <li><NavLink to='/signup'>Sign up</NavLink></li>
                </ul>
                
            
        )
    }


    render(){

        console.log(this.props, `in render function account head`)
        let content;

        if(this.props.isAuth){
            content = this.authorized();
           
        }
        else{
            content = this.unauthorized()

        }

        return(
            <div className="flexMe">
                {content}
            </div>
            
        )
    }
}

// export default AccountHead;
export default connect(mapStateToProps)(AccountHead)

// Code here will be ignored by JSHint.
/* jshint ignore:end */