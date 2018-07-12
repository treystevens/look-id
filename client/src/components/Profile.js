import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead';
import { getData, sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';
import Avatar from './Avatar';


class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            userProfileHead: {},
            streamData: {},
            iFollow: false,
            followerCount: 0,
            followText: 'Follow',
        };

        // this.handleClickFollowText = this.handleClickFollowText.bind(this);
        this.handleFollowerCount = this.handleFollowerCount.bind(this);
    }


    // Get the requested user's profile data
    componentDidMount(){
        const urlParamUser = this.props.urlParams.match.params.user;
        const serverResponse = getData(`/user/${urlParamUser}`);


        
        serverResponse.then(response => response.json())
        .then((data) => {
            let followText;

            data.user.alreadyFollowing ? followText = 'Unfollow' : followText = 'Follow' ;

            // Send to profile header (Avatar, Followers/Following, Bio, Website)
            const userProfileHeadData = {
                followerCount: data.user.followerCount,
                followingCount: data.user.followingCount,
                bio: data.user.bio,
                website: data.user.website,
                avatarUrl: data.user.avatar,
                username: data.user.username,
            };

            // For outputting the requested user's post
            const streamUserData = {
                username: data.user.username,
                posts: data.user.posts
            };

            this.setState({
                    userProfileHead: userProfileHeadData,
                    streamData: streamUserData,
                    followText: followText,
                    iFollow: data.user.alreadyFollowing,
                });
        })
        .catch((err) => {
            console.log(err);
        });
    }


    // Pass to FollowButton
    handleFollowerCount(isFollowing){

        console.log(isFollowing)
         

        // isFollowing ? action = 'INCREMENT' : action = 'DECREMENT';

        // this.props.handleFollowerCount(action);

        // console.log(action)
        let updatedFollowerCount = Object.assign({}, this.state.userProfileHead);

        if(isFollowing){
            updatedFollowerCount.followerCount += 1;

            this.setState({
                followText: 'Unfollow',
                iFollow: true,
                userProfileHead: updatedFollowerCount
            });
        }
        else{
            updatedFollowerCount.followerCount -= 1;
            this.setState({
                followText: 'Follow',
                iFollow: false,
                userProfileHead: updatedFollowerCount
            });
        }

    

    }

      
    render(){
    
        // Store the requested user
        let user = this.props.urlParams.match.params.user;
        
        return(
            <section>
                <PageHead pageHead='Profile' />
                <UserProfileHead urlParamUser={user} data={this.state.userProfileHead} iFollow={this.state.iFollow} handleClickFollowText={this.handleClickFollowText} handleFollowerCount={this.handleFollowerCount} followText={this.state.followText}/>
                <Stream sourceFetch='profile' urlParamUser={user} data={this.state.streamData}/>
            </section>
        )
    }
}

function mapStateToProps(state){
    console.log(state)
    return{
        myAvatar: state.avatar
    }
}


export default connect(mapStateToProps)(Profile)