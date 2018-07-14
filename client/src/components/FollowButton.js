import React, { Component } from 'react';
import { sendUserData } from '../util/serverFetch';


class FollowButton extends Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }



    // On click send to server a request to follow or unfollow
    handleClick(){
        console.log(this.props);
        

        const iFollow = this.props.iFollow;
        const urlParamUser = this.props.urlParamUser;
        const username = this.props.username;
        const data = {
            iFollow: iFollow,
        };
        console.log(username)

        // Send to server if we follow user or not
        const serverResponse = sendUserData(`/user/${username}/followers`, data);

        serverResponse.then(response => response.json())
        .then((data) => {
            console.log(data.iFollow);

            
            // Lift iFollow (Boolean) state to ~ UserProfileHead > Profile
            // Only do if this component is a descendant of Profile 
            if(this.props.handleFollowerCount){
                this.props.handleFollowerCount(data.iFollow);
            }

        })
        .catch((err) => {
            console.log(err, 'Could not perform action at this time');
        });
    }

    render(){

        

        return(
             <div onClick={this.handleClick}>
                <button type='button'>{this.props.followText}</button>
            </div>
        )
    }

}



export default FollowButton
