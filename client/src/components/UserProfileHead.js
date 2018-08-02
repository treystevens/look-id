import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import Modal from './Modal';
import { connect } from 'react-redux';
import FollowButton from './FollowButton';
import { prefixURL } from '../util/general';
import Button from './Button';
import './UserProfile.css';
import './Modal.css';


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
        if(evt.target.className === 'up__ff'){
            const ffText = evt.target.textContent;

            this.setState({
                showModal: true,
                followAction: ffText
            });
        }
        
    }

    // Close Modal on click
    closeModal(evt){
        if(evt.target.className === 'modal' || evt.target.classList.contains('btn__close--modal') || evt.target.classList.contains('btn__cancel--modal')){
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
        const url = prefixURL(this.props.data.website);

        // Checking to see if requested user is the same user logged in viewing their own profile
        // If so, include upload post feature and remove follow button
        if(this.props.urlParamUser === this.props.username){
            uploadPost = true;
            showFollowButton = false;
        }

        return(
            <section>
                <section className='up'>
                    <div>
                        <Avatar avatar={this.props.data.avatar} username={this.props.urlParamUser} addClass='avatar-container--med'/>
                        <div className='up__username'>{this.props.urlParamUser}</div>
                    </div>
                    <div>
                        
                        <div className='up__ff'>
                            <div className='up__ff--position'>
                                <a onClick={this.handleClick}>
                                    <span className='up__ff'>Followers</span>
                                    <span className='up__ff-count up--bold'>{this.props.data.followerCount}</span>
                                </a>
                            
                                <a onClick={this.handleClick} >
                                    <span className='up__ff'>Following</span>
                                    <span className='up__ff-count up--bold'>{this.props.data.followingCount}</span>
                                </a>
                            </div>

                            <div className='up__follow-btn'>
                                {showFollowButton &&
                                    <FollowButton followText={this.props.followText} iFollow={this.props.iFollow} urlParamUser={this.props.urlParamUser} reqUserAvatar={this.props.data.avatarUrl} user={this.props.data.username}  handleFollowerCount={this.props.handleFollowerCount}/>
                                }
                            </div>
                        
                        </div>
                            <div className='up__info'>
                                <span className='up__bio up--bold'>{this.props.data.bio}</span>
                        
                                <a href={url} target='_blank' className='up__website'>{url}</a>
                            </div>
                    </div>

                    
                </section>

                {uploadPost && 
                    <div className='edit-container'>
                        <Link to='/profile/upload'>
                            <Button dummy={true} text='Post a new photo' />
                        </Link>
                    </div>
                }

                {this.state.showModal &&
                    <Modal source='ff' closeModal={this.closeModal} urlParamUser={this.props.urlParamUser} followAction={this.state.followAction}  escCloseModal={this.escCloseModal} handleFollowingCount={this.props.handleFollowingCount} addClass='modal-content--midt'/>
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
