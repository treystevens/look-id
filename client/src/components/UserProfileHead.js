import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Modal from './Modal';
import { connect } from 'react-redux';
import FollowButton from './FollowButton';



class UserProfileHead extends Component{
    constructor(props){
        super(props);

        this.state = {
            showModal: false,
            followAction: ''
        };
            this.handleClick = this.handleClick.bind(this);
            this.closeModal = this.closeModal.bind(this);
    }

    // Click Event for 'Followers' & 'Followers' to show Modal - FF Component
    handleClick(evt){
        evt.preventDefault();
        if(evt.target.className === 'user__ff'){
            const ffText = evt.target.textContent;

            this.setState({
                showModal: true,
                followAction: ffText
            });
        }
        
    }

    // Close Modal on click
    closeModal(evt){
        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false,
            });
        }
    }

    // Close modal with `esc` key
    componentDidUpdate(){

        window.addEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
        });
    }

    render(){
        
        let uploadPost = false;
        let showFollowButton = true;

        // Checking to see if requested user is the same user logged in viewing their own profile
        // If so, include upload post feature and remove follow button
        if(this.props.urlParamUser === this.props.username){
            uploadPost = true;
            showFollowButton = false;
        }

        return(
            <section>
                <section style={{margin: '0 auto', width: '40%'}}>
                    
                    <Avatar avatar={this.props.data.avatarUrl}/>
                    <span>{this.props.urlParamUser}</span>
                    <div>
                        <a onClick={this.handleClick}>
                            <span className='user__ff'>Followers</span>
                            <span>{this.props.data.followerCount}</span>
                        </a>
                    </div>
                    <div>
                        <a onClick={this.handleClick} >
                            <span className='user__ff'>Following</span>
                            <span>{this.props.data.followingCount}</span>
                        </a>
                    </div>

                        <span>{this.props.data.bio}</span>
                    
                    <a href={this.props.data.website}>{this.props.data.website}</a>

                    {showFollowButton &&
                        <FollowButton followText={this.props.followText} iFollow={this.props.iFollow} urlParamUser={this.props.urlParamUser} reqUserAvatar={this.props.data.avatarUrl} user={this.props.data.username}  handleFollowerCount={this.props.handleFollowerCount}/>
                    }
                </section>

                {uploadPost && 
                    <Link to="/profile/upload">Post a new photo</Link>
                }

                {this.state.showModal &&
                    <Modal source="ff" closeModal={this.closeModal} urlParamUser={this.props.urlParamUser} followAction={this.state.followAction}  escCloseModal={this.escCloseModal} handleFollowingCount={this.props.handleFollowingCount}/>
                }
                
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
      username: state.username,
      isAuth: state.isAuth
    };
}

export default connect(mapStateToProps)(UserProfileHead);
