import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'; 
import NotificationIcon from './NotificationIcon';
import { connect } from 'react-redux';
import { getData } from '../util/serverFetch';
import PropTypes from 'prop-types';
import './Header.css';
import './Notifications.css';

function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
    };
}

class AccountNav extends Component{
    constructor(props){
        super(props);
        this.state = {
            shownContent: '',
            redirect: false,
            isMobile: false
        };

        this.unauthorized = this.unauthorized.bind(this);
        this.authorized = this.authorized.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
    }


    // Determines desktop or mobile view
    componentDidMount(){

        // Check if mobile
        const isMobile = window.matchMedia('only screen and (max-width: 600px)');
        
        if (isMobile.matches) {
            this.setState({
                isMobile: true
            });
        }
    }

    // ClickEvent --> Boolean
    // Sets redux's state "isAuth" to false
    logoutHandler(evt){
        evt.preventDefault();

        const serverResponse = getData('/auth/logout');
        
        serverResponse
        .then( response => response.json() )
        .then((data) => {

            if(!data.isAuth){
                this.props.dispatch({type: 'LOGOUT'});
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    // Boolean (triggered by isAuth) --> Account Navigation View
    // View of account navigation if user is authorized
    authorized(){
        
        const userLink = `/user/${this.props.username}`;
        const { isMobile } = this.state;
        const profileDisplay = isMobile ? 'View Profile' : this.props.username;
        let notification;

        const { mobileNotification } = this.props;

        

        // Mobile navigation
        if(isMobile){

            let notificationLight = 'notications__nav-light';
            if(mobileNotification) notificationLight = 'notifications__nav-light--lit';

            notification = (
            <li className='account-nav-list__item'>
                <NavLink to='/profile/notifications' onClick={this.props.resetNotification} className='nav-item__link  account-nav-notifications'>Notifications
                <div className={notificationLight}></div>
                </NavLink>
            </li>)
        }
        // Not mobile
        else{
            notification = (
            <li className='account-nav-list__item'>
                <NavLink to='/profile/notifications' className='nav-item__link'>
                    <div className='notification-icon__body'>
                        <NotificationIcon />
                    </div>
                </NavLink>
            </li>)
        }

        return(
          
                <ul className='account-nav-list  account-nav--logged'>
                    <li className='account-nav-list__item'>
                        <NavLink to={userLink} className='nav-item__link'>{profileDisplay}</NavLink>
                    </li>
                    {notification}
                    <li className='account-nav-list__item'>
                        <NavLink to='/profile/edit' className='nav-item__link'>Edit Profile</NavLink>
                    </li>
                    <li className='account-nav-list__item'>
                        <NavLink to='/profile/settings' className='nav-item__link'>Settings</NavLink>
                    </li>
                    <li className='account-nav-list__item'>
                        <a href='/auth/logout' onClick={this.logoutHandler} className='nav-item__link'>Log Out</a>
                    </li>
                </ul>
                
             
        )
    }

    // Boolean (triggered by isAuth) --> Account Navigation View
    // View of account navigation if user is NOT authorized
    unauthorized(){
        return (
                <ul className='account-nav-list'>
                    <li className='account-nav-list__item'><NavLink to='/login'>Log in</NavLink></li>
                    <li className='account-nav-list__item'><NavLink to='/signup'>Sign up</NavLink></li>
                </ul>
        )
    }


    render(){
        let content;

        if(this.props.isAuth){
            content = this.authorized();  
        }
        else{
            content = this.unauthorized()
        }

        return(
            <div className='header-account-nav'>
                {content}
            </div>    
        )
    }
}

export default connect(mapStateToProps)(AccountNav)


AccountNav.propTypes = {
    isAuth: PropTypes.bool,
    username: PropTypes.string,
    mobileNotification: PropTypes.bool,
    resetNotification: PropTypes.bool
}