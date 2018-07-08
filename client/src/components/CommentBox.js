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
    }

    
    closeModal(evt){
        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false
            });
        }   
    }


    handleSubmit(evt){
        evt.preventDefault();


        if(!this.props.isAuth){
            this.setState({
                showModal: true
            });
        }

        if(this.state.commentValue === ''){
            this.setState({
                blankSubmit: true
            });
        }

        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let currentDate = new Date();

        let dayDate = currentDate.getDate();
        let monthIndex = currentDate.getMonth();
        let year = currentDate.getFullYear();
        let month = months[monthIndex];

        let date = `${month} ${dayDate}, ${year}`;

        const userPage = {
            username: this.props.urlParams.username,
            postID: this.props.urlParams.postID
        };

        const newComment = {
            username: this.props.username, // get from auth token I guess...from cookie?
            date_posted: date,
            comment: this.state.commentValue,
            avatar: this.props.avatar
        };

        const data = {
            newComment: newComment,
            userPage: userPage
        };


        const serverResponse = sendUserData('/comment', data);

        serverResponse.then(response => response.json())
        .then((data) => {
            console.log(data, `response from comment`);

            // Response from server checking if it's an empty comment
            if(!data.success){
                this.setState({
                    blankSubmit: true
                });
            }

            // pass back the data needed to display the comment
            this.props.handleAddComment(data.comment);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleComment(evt){
        this.setState({
            commentValue: evt.target.value
        });
    }

    render(){
        let blankSubmitMessage = 'Please enter a message';

        return(
                <div style={{width: '100%'}}>
                    <form onSubmit={this.handleSubmit} style={{display: 'flex', 'flexDirection': 'column'}}>
                        {this.state.blankSubmit &&
                        <span>{blankSubmitMessage}</span>}
                        <textarea className="comment__box" cols="50" rows="3" onChange={this.handleComment} name='comment'></textarea>
                        <button>Submit Comment</button>
                    </form>
                    {this.state.showModal && <Modal source='accountVerify' closeModal={this.closeModal}/>}
                </div>
                )
    }

}



// Might add an avatar to redux store for comments
function mapStateToProps(state) {
    return {
      username: state.username,
      isAuth: state.isAuth,
      avatar: state.avatar
    };
}


export default connect(mapStateToProps)(CommentBox);