import React, { Component } from 'react';
import CommentBox from './CommentBox';
import CommentRow from './CommentRow';
import ConfirmAction from './ConfirmAction';
import { getData, sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';
import './Comments.css';


class Comments extends Component{
    constructor(props){
        super(props);
        this.state = {
            comments: [],
            commentsViewAll: false,
            showConfirmation: false,
            actionSuccess: false,
            statusMessage: ''
        };

        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.handleClickViewAll = this.handleClickViewAll.bind(this);
    }


    // Fetch comments
    componentDidMount(){


        const urlPageUsername = this.props.urlParams.username;
        const urlPagePostID = this.props.urlParams.postID;

        // Fetch to Server
        const serverResponse = getData(`/comment/${urlPageUsername}/${urlPagePostID}`);
        
        serverResponse.then( response => response.json())
        .then((data) => {
            
            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                comments: data.comments
            });
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        });     
    }

    // View all comments
    handleClickViewAll(evt) {
        evt.preventDefault();

        let view;

        // Toggle view
        this.state.commentsViewAll ? view = false : view = true

        this.setState({
            commentsViewAll: view
        });
    }

    // Adding new comment
    handleAddComment(newComment){
        this.setState({
            comments: this.state.comments.concat(newComment)
        });
    }
    
    // Deleting comment
    handleDeleteComment(commentIndex, componentKeyID){

        const currentState = this.state.comments;
        // eslint-disable-next-line
        const updatedStateComment = currentState.filter((item, index) => {
            if(index !== commentIndex){
                return item;
            }
        });

        const data = {
            id: componentKeyID,
            pagePostID: this.props.urlParams.postID
        };

        const serverResponse = sendUserData('/comment/delete', data);

        serverResponse.then( response  => response.json())
        .then((data) => {
            
            if(data.error) return Promise.reject(new Error(data.error));

            if(data.success){
                this.setState({
                    comments: updatedStateComment
                });
            }
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        });
        
    }

    render(){


        const viewingUser = this.props.username || false;
        const { commentsViewAll, comments } = this.state;
        let userComments;
        let commentViewAction;

        // Handle view all
        if(comments.length > 0){
            if(commentsViewAll){
                userComments = comments.map((comment, index) => {
                    return <CommentRow comment={comment} handleDeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser} key={comment._id} index={index}/>
                })
            }
            else{
                userComments = comments.slice(0,5).map((comment, index) => {
                    return <CommentRow comment={comment} handleDeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser} key={comment._id} index={index}/>
                })
            }
            
        }
        commentsViewAll ? commentViewAction = 'Collapse comments' : commentViewAction = 'View all comments'

        return(
            <section className='comments'>
                <CommentBox handleAddComment={this.handleAddComment} urlParams={this.props.urlParams}/>
                {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                    }
                <div>
                    <div className='comments-container'>
                        {userComments}
                        <a href='/viewallcomments' onClick={this.handleClickViewAll}>{commentViewAction}</a>
                    </div>
                </div> 
                
            </section>
            
        )
    }
}

function mapStateToProps(state){
    return{
        username: state.username
    }
}

export default connect(mapStateToProps)(Comments);