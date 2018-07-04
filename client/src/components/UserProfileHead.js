import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { getData } from '../util/serverFetch';
import FF from './FF';
import { connect } from 'react-redux';



class UserProfileHead extends Component{
    constructor(props){
        super(props);

        this.state = {
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


    render(){

        let uploadPost = false;

        if(this.props.urlParams === this.props.username){
            uploadPost = true;
        }


        return(
            <section>
                <section style={{margin: '0 auto', width: '40%'}}>
                    
                    <Avatar avatarUrl={this.props.data.avatarUrl}/>
                    <span>{this.props.urlParams}</span>
                    <div>
                        <a href=''>
                            <span onClick={this.handleClick} className='user__followers'>Followers</span>
                            <span>{this.props.data.followerCount}</span>
                        </a>

                    </div>
                    <div>
                        <span onClick={this.handleClick} className='user__following'>Following</span>
                        <span>{this.props.data.followingCount}</span>
                    </div>

                        <span>{this.props.data.bio}</span>
                    
                    <a href={this.props.data.website}>{this.props.data.website}</a>
                </section>

                {uploadPost && 
                <Link to="/profile/upload">Post a new photo</Link>
                }
                
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
      username: state.username,
    };
}

export default connect(mapStateToProps)(UserProfileHead);