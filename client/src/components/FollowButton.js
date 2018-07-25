import React, { Component } from 'react';
import { sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';
import Modal from './Modal';


class FollowButton extends Component{
    constructor(props){
        super(props);

        this.state = {
            followText: 'Follow',
            showModal: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.changeFollowText = this.changeFollowText.bind(this);
        this.closeModal = this.closeModal.bind(this);

        // Close Modal with Escape Key
        window.addEventListener('keydown', (evt) => {

            const { showModal } = this.state;

            if( showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
        });
    }

    // Change followText on mount
    componentDidMount(){
        this.changeFollowText(this.props.iFollow);
    }

    // Close Boards Modal
    closeModal(evt){
        if(evt.target.className === 'modal' || evt.target.className === 'modal__close-btn'){
            this.setState({
                showModal: false
            });
        }   
    }

    // Update followText when component recieves new props
    componentDidUpdate(prevProps){ 
        if(prevProps.iFollow !== this.props.iFollow){
            this.changeFollowText(this.props.iFollow);
        }
    }


    changeFollowText(iFollow){
        let followText;
        iFollow ? followText = 'Following' : followText = 'Follow';

        this.setState({
            followText: followText
        });
    }

    // On click send to server a request to follow or unfollow
    handleClick(){    

        const iFollow = this.props.iFollow;
        const urlParamUser = this.props.urlParamUser;
        const user = this.props.user;
        const data = {
            iFollow: iFollow,
        };

        // If user is not authorize prompt login Modal
        if(!this.props.isAuth){
            this.setState({
                showModal: true
            });
            return -1;
        }

        // Follow or unfollow user
        const serverResponse = sendUserData(`/user/${user}/followers`, data);

        serverResponse.then(response => response.json())
        .then((data) => {
            
            // Update followText state
            this.changeFollowText(data.iFollow);
            
            // Lift iFollow (Boolean) state to UserProfileHead > Profile
            // Only do if this component is a descendant of Profile 
            if(this.props.handleFollowerCount){
                this.props.handleFollowerCount(data.iFollow);
            }
            
            // If viewing your own 'Following' list and you unfollow someone update 'followingCount' state found in Profile Component
            if(this.props.followAction === 'Following' && this.props.myUsername === urlParamUser){
                this.props.handleRemoveFollowing(this.props.index);
                this.props.handleFollowingCount();
            }

        })
        .catch((err) => {
            console.log(err, 'Could not perform action at this time');
        });
    }

    render(){
        const { showModal } = this.state;


        return(
            <div>
                <button type='button'  onClick={this.handleClick}>{this.state.followText}</button>

                {showModal && 
                    <Modal source='accountVerify' closeModal={this.closeModal} image={this.props.image} urlParams={this.props.urlParams}/>}
            </div>
        )
    }

}


function mapStateToProps(state){
    return{
        isAuth: state.isAuth,
        username: state.username
    }
}



export default connect(mapStateToProps)(FollowButton);
