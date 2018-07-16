import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead';
import { getData } from '../util/serverFetch';


class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            userProfileHead: {},
            streamData: {},
            iFollow: false,
        };

        this.handleFollowerCount = this.handleFollowerCount.bind(this);
        this.handleFollowingCount = this.handleFollowingCount.bind(this);
    }


    // Get the requested user's profile data
    componentDidMount(){

    
        const urlParamUser = this.props.urlParams.match.params.user;
        const serverResponse = getData(`/user/${urlParamUser}`);


        // Fetch Data
        serverResponse.then(response => response.json())
        .then((data) => {

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
                    iFollow: data.user.iFollow,
                });
        })
        .catch((err) => {
            console.log(err);
        });
    }
   

    // Passed down to FollowButton Component
    handleFollowerCount(isFollowing){     

        // Follower count is nested inside our user profile head
        const updateFollowerCount = Object.assign({}, this.state.userProfileHead);

        // If we follow update count and switch FollowButton component text to 'Unfollow'
        if(isFollowing){
            updateFollowerCount.followerCount += 1;

            this.setState({
                iFollow: true,
                userProfileHead: updateFollowerCount
            });
        }
        else{
            updateFollowerCount.followerCount -= 1;

            this.setState({
                iFollow: false,
                userProfileHead: updateFollowerCount
            });
        }
    }

    // Passed down to FollowButton Component with FF Component as Ancestor
    handleFollowingCount(){
        const updateFollowingCount = Object.assign({}, this.state.userProfileHead);
        
        updateFollowingCount.followingCount -= 1;

        this.setState({
            userProfileHead: updateFollowingCount
        });

    }

      
    render(){
    
        // Reference the requested user
        const user = this.props.urlParams.match.params.user;
        
        return(
            <section>
                <PageHead pageHead='Profile' />
                <UserProfileHead urlParamUser={user} data={this.state.userProfileHead} iFollow={this.state.iFollow} handleClickFollowText={this.handleClickFollowText} handleFollowerCount={this.handleFollowerCount} handleFollowingCount={this.handleFollowingCount}/>
                <Stream sourceFetch='profile' urlParamUser={user} data={this.state.streamData}/>
            </section>
        )
    }
}



export default Profile