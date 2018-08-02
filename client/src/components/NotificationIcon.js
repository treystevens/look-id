import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'; 
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import './Notifications.css';


class NotificationIcon extends Component{
    constructor(props){
        super(props);

        this.state = {
            newNotifications: false
        };

        this.loadNotifications = this.loadNotifications.bind(this);
    }


    // Check for new notifications
    componentDidMount(){
        this.loadNotifications();
    }

    
    componentDidUpdate(prevProps){
        if(this.props.notifications !== prevProps.notifications){
            this.loadNotifications();
        }
    }

    loadNotifications(){
        const serverResponse = getData('/user/notifications-check');

        serverResponse
        .then(response => response.json())
        .then((data) => {

            this.setState({
                newNotifications: data.newNotifications
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render(){

        const { newNotifications } = this.state;
        let LED;

        newNotifications ? LED = 'notifications__light' : LED = 'notifications__dull';

        return(
                    <NavLink to='/profile/notifications'>
                        <div style={{width: '20px', height: '20px', border: '1px solid gray', borderRadius: '2px', position: 'relative'}}>

                            <div className={LED} style={{position: 'absolute', right: '-5px', top: '-5px', borderRadius: '50%', width: '10px', height: '10px'}}> 
                            </div>

                        </div>
                    </NavLink>
        )
    }
}

function mapStateToProps(state){
    return{
        username: state.username,
        notifications: state.notifications
    }
}


export default connect(mapStateToProps)(NotificationIcon);