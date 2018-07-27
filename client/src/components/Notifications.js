import React, { Component } from 'react';
import { getData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import PageHead from './PageHead';
import NotificationItem from './NotificationItem';


class Notifications extends Component{
    constructor(props){
        super(props);

        this.state = {
            notifications: [],
            showConfirmation: '',
            actionSuccess: false,
            statusMessage: '',
            isLoading: false,
            hasMore: true,
            scrollCount: 0
        };

        this.onScroll = this.onScroll.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
        window.addEventListener('scroll', this.onScroll);


        // Set viewed property on database to true
        fetch('/user/notifications', {
            method: 'PUT',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(() => {
            
            this.loadData();
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        });
    }
   
    // Remove event listener
    componentWillUnmount(){
        window.removeEventListener('scroll', this.onScroll);
    }

    loadData(){
        this.setState({
            isLoading: true
        });

        const { scrollCount, notifications } = this.state;
        
        const serverResponse = getData(`/user/notifications/v/${scrollCount}`);

        serverResponse
        .then(response => response.json())
        .then((data) => {
            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                notifications: notifications.concat(data.notifications),
                hasMore: data.hasMore,
                isLoading: false
            });
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        });


    }

    // For Infinite Scroll
    onScroll(){
        
        const  { error, isLoading, hasMore } = this.state;
        

        // Return if there's an error, already loading or there's no more data from the database
        if (error || isLoading || !hasMore) return;

        // Check if user has scrolled to the bottom of the page
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 150) {
            
            // Using scrollCount to mimic pages
            const { scrollCount } = this.state;
            const newCount = scrollCount + 1;
            
            
            this.setState({
                scrollCount: newCount
            }, () => {
                this.loadData();
            });  
        }
    }

    render(){

        const { notifications } = this.state;

        const showNotifications = notifications.map((notification) => {
            return <NotificationItem notification={notification}  key={notification._id}/>
        });

        return(
            <section style={{display: 'flex', flexDirection:'column'}}>
                <PageHead pageHead='Notifications' />

                {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.confirmAction} statusMessage={this.state.statusMessage}/>
                    }
                { showNotifications }
            </section>
        )
    }
}


export default Notifications