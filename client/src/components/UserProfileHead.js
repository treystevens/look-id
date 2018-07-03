import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { getData } from '../util/serverFetch';



class UserProfileHead extends Component{
    constructor(props){
        super(props);

        this.state = {
            followerCount: '',
            followingCount: '',
            bio: '',
            website: '',
            avatarUrl: '',
            showFollowers: false,
            showFollowing: false
        };
            this.handleClick = this.handleClick.bind(this);
            this.handleCloseModal = this.handleCloseModal.bind(this);
    }




    handleClick(evt){
        if(evt.target.className === 'user__followers'){
            this.setState({
                showFollowers: true,
            });
            
        }

        if(evt.target.className === 'user__following'){
            this.setState({
                showFollowing: true,
            });
            
        }

        console.log(`clicking working`)
    }

    handleCloseModal(evt){
        if(evt.target.className === 'user__modal'){
            this.setState({
                showFollowing: false,
                showFollowers: false
            });
        }
        
    }


    componentDidMount(){
        const serverResponse = getData('/profile');

        serverResponse.then(response => response.json())
        .then((data) => {


            console.log(data);


            this.setState({
                followerCount: data.user.followerCount,
                followingCount: data.user.followingCount,
                bio: data.user.bio,
                website: data.user.website,
                avatarUrl: data.user.avatar
            });
        })
        .catch((err) => {
            console.log(err);
        });


    }

    render(){
        return(
            <section>
                <section style={{margin: '0 auto', width: '40%'}}>
                    
                    <Avatar avatarUrl={this.state.avatarUrl}/>
                    <div>
                        <span onClick={this.handleClick} className='user__followers'>Followers</span>
                        <span>{this.state.followerCount}</span>
                    </div>
                    <div>
                        <span onClick={this.handleClick} className='user__following'>Following</span>
                        <span>{this.state.followingCount}</span>
                    </div>

                        <span>{this.state.bio}</span>
                    
                    <a href={this.state.website}>{this.state.website}</a>
                </section>
                <Link to="/profile/upload">Post a new photo</Link>
            </section>
        )
    }
}


export default UserProfileHead;