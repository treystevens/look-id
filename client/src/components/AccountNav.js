import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'; 
import NotificationIcon from './NotificationIcon';
import { connect } from 'react-redux';
import { getData } from '../util/serverFetch';
import './Header.css';


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

    componentDidMount(){


        // Check if mobile
        const isMobile = window.matchMedia("only screen and (max-width: 768px)");
        
        if (isMobile.matches) {
          this.setState({
            isMobile: true
          });
        }
    

      }

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


    authorized(){
        const userLink = `/user/${this.props.username}`;
        const { isMobile } = this.state;
        const profileDisplay = isMobile ? 'View Profile' : this.props.username;
        let notification;
        

        if(isMobile){
            notification = (<li className='account-nav-list__item'><NavLink to='/profile/notifications'>Notifications</NavLink></li>)
        }
        else{
            notification = (<li className='account-nav-list__item'><NotificationIcon /></li>)
        }

        return(
          
                <ul className='account-nav-list  account-nav--logged'>
                    
                    <li className='account-nav-list__item'><NavLink to={userLink}>{profileDisplay}</NavLink>
                    </li>
                    {notification}
                    <li className='account-nav-list__item'><NavLink to='/profile/edit'>Edit Profile</NavLink></li>
                    <li className='account-nav-list__item'><NavLink to='/profile/settings'>Settings</NavLink></li>
                    <li className='account-nav-list__item'><a href='/auth/logout' onClick={this.logoutHandler}>Log Out</a></li>
                </ul>
                
             
        )
    }

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
