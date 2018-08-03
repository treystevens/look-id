import React, { Component } from 'react';
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
            }, () => {
                
                const { handleNotification } = this.props;
                if(handleNotification){
                    if(data.newNotifications) this.props.handleNotification();
                }
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

            <div className={LED}> 
            </div>

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