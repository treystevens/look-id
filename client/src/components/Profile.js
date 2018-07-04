import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import Avatar from './Avatar';


class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            userProfileHead: {},
            streamData: {}
        };
    }


    componentDidMount(){

        let urlUserParam = this.props.urlParams.match.params.user;
        const serverResponse = getData(`/user/${urlUserParam}`);


        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {

            // Send to profile header
            const userProfileHeadData = {
                followerCount: data.user.followerCount,
                followingCount: data.user.followingCount,
                bio: data.user.bio,
                website: data.user.website,
                avatarUrl: data.user.avatar,
                username: data.user.username,
                
            };

            // For Outputting posts
            const streamUserData = {
                username: data.user.username,
                posts: data.user.posts
            };

            this.setState({
                    userProfileHead: userProfileHeadData,
                    streamData: streamUserData
                });


        })
        .catch((err) => {
            console.log(err);
        });


    }


      
    render(){
        let user = this.props.urlParams.match.params.user;

        return(
            <section>
                <PageHead pageHead='Profile' />
                <UserProfileHead urlParams={user} data={this.state.userProfileHead}/>
                <Stream sourceFetch='profile' urlParams={user} data={this.state.streamData}/>
            </section>
        )
    }
}


export default Profile