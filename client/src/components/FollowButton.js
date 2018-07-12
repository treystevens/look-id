import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendUserData } from '../util/serverFetch';


class FollowButton extends Component{
    constructor(props){
        super(props);

        this.state = {
            followText: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }



    // On click send to server a request to follow or unfollow
    handleClick(){
        console.log(this.props)


        const isFollowing = this.props.iFollow;
        const urlParamUser = this.props.urlParamUser;
        // Change the reqUserAvatar to a prop that's passed in
        // Passed in from Profile -> person.avatar and passed in from FF
        // const reqUserAvatar = document.querySelector('.avatar').getAttribute('src');
        const reqUserAvatar = this.props.reqUserAvatar;

        

        const data = {
            myUserData: {
                isFollowing: isFollowing,
                avatar: this.props.myAvatar
            },
            userToFollow: {
                username: urlParamUser,
                avatar: reqUserAvatar
            }
            
        };

        
        const serverResponse = sendUserData(`/user/${urlParamUser}/followers`, data);

        serverResponse.then(response => response.json())
        .then((data) => {
            console.log(data.isFollowing)

            if(this.props.handleFollowerCount){
                this.props.handleFollowerCount(data.isFollowing);
            }

        })
        .catch((err) => {
            console.log(err, 'Could not perform action at this time');
        });

        

    }


    handleFollow(evt){
        

        
    }

    render(){

        console.log(this.props)
        return(
             <div onClick={this.handleClick}>
                <button type='button'>{this.props.text}</button>
            </div>
        )
    }

}

function mapStateToProps(state){
    return{
        myAvatar: state.myAvatar
    }
}

export default connect(mapStateToProps)(FollowButton);
