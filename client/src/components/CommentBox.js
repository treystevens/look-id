import React, { Component } from 'react';
import { sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';
import Modal from './Modal';


class CommentBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            commentValue: '', 
            blankSubmit: false,
            showModal: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.escModal = this.escModal.bind(this);
    }

    componentDidMount(){
        window.addEventListener('keydown', this.escModal);
    }

    // Remove event listener
    componentWillUnmount(){
        window.removeEventListener('keydown', this.escModal);
    }

    // Close Modal (Login/Sign Up)
    closeModal(evt){

        const body = document.getElementsByTagName("BODY")[0];
        body.classList.remove('noscroll');

        if(evt.target.className === 'modal' || evt.target.classList.contains('btn__close--modal') || evt.target.classList.contains('btn__cancel--modal')){
            this.setState({
                showModal: false
            });
        }   
    }

    // Close modal with esc key
    escModal(evt){

        const body = document.getElementsByTagName("BODY")[0];
        body.classList.remove('noscroll');

        if(this.state.showModal && evt.keyCode === 27){
            this.setState({
                showModal: false,
            });
        }
    }

    // Submit new comment
    handleSubmit(evt){
        evt.preventDefault();
        
        // Empty comment box
        const commentBox = document.querySelector('.comment__box');
        commentBox.value = '';
        this.setState({
            commentValue: ''
        });

        // If user is not authorize prompt login Modal
        if(!this.props.isAuth){

            
            const body = document.getElementsByTagName("BODY")[0];
            body.classList.add('noscroll');

            this.setState({
                showModal: true
            });
            return -1;
        }

        // Error check if blank message is entered
        if(this.state.commentValue === ''){
            this.setState({
                blankSubmit: true
            });
            return -1;
        }

        

        // Set up date user commented
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const currentDate = new Date();
        const dayDate = currentDate.getDate();
        const monthIndex = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const month = months[monthIndex];
        const date = `${month} ${dayDate}, ${year}`;

        // Data from page user is currently on
        const userPage = {
            username: this.props.urlParams.username,
            postID: this.props.urlParams.postID
        };

        // User commenting data
        const newComment = {
            username: this.props.username,
            date_posted: date,
            comment: this.state.commentValue,
        };

        // Send this data to server
        const data = {
            newComment: newComment,
            userPage: userPage
        };

        // Server Fetch
        const serverResponse = sendUserData('/comment', data);

        serverResponse.then(response => response.json())
        .then((data) => {

            // Response from server checking if it's an empty comment
            if(!data.success){
                this.setState({
                    blankSubmit: true
                });
            }
            else{
                // Pass the newly created comment up to Comments Component
                this.props.handleAddComment(data.comment);
            }
            
        })
        .catch((err) => {
            console.log(err);
        });
    }

    // Comment input value
    handleComment(evt){
        this.setState({
            commentValue: evt.target.value
        });
    }

    render(){
        const blankSubmitMessage = 'Please enter a message';

        return(
                <div className='comment-form-container'>
                    <form onSubmit={this.handleSubmit} style={{display: 'flex', 'flexDirection': 'column'}}>

                        {this.state.blankSubmit &&
                        <span>{blankSubmitMessage}</span>}

                        <textarea className="comment__box" onChange={this.handleComment} name='comment'></textarea>
                        <button className='comment__btn'>Add Comment</button>
                    </form>
                    {this.state.showModal && <Modal source='accountVerify' closeModal={this.closeModal}/>}
                </div>
                )
    }

}


function mapStateToProps(state) {
    return {
      username: state.username,
      isAuth: state.isAuth,
    };
}


export default connect(mapStateToProps)(CommentBox);