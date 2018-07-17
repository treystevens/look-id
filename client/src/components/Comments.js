import React, { Component } from 'react';
import CommentBox from './CommentBox';
import CommentRow from './CommentRow';
import { getData, sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';


class Comments extends Component{
    constructor(props){
        super(props);
        this.state = {
            comments: [],
            commentsViewAll: false
        };

        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.handleClickViewAll = this.handleClickViewAll.bind(this);
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

        console.log(componentKeyID);


        let currentState = this.state.comments;
        let updatedStateComment = currentState.filter((item, index) => {
            if(index != commentIndex){

                console.log(index)
                
                return item;
            }
            else{
                console.log('huhushauishdasjd')
            }
        });

        const data = {
            id: componentKeyID,
            pagePostID: this.props.urlParams.postID
        }

        console.log(this.props)

        const serverResponse = sendUserData('/comment/delete', data);

        serverResponse.then( response  => response.json())
        .then((data) => {
            console.log(data);

            if(data.success){
                this.setState({
                    comments: updatedStateComment
                });
            }
        })
        .catch((err) => {
            console.log(err)
        });
        
    }

    // Fetch comments
    componentDidMount(){


        const urlPageUsername = this.props.urlParams.username;
        const urlPagePostID = this.props.urlParams.postID;

        // Fetch to Server
        const serverResponse = getData(`/comment/${urlPageUsername}/${urlPagePostID}`);
        
        serverResponse.then( response => response.json())
        .then((data) => {
    
            this.setState({
                comments: data.comments
            });
        })
        .catch((err) => {
            console.log(err);
        });     
    }


    render(){


        const viewingUser = this.props.username || false;

        let userComments;
        let commentViewAction;

        // Handle view all
        if(this.state.comments.length > 0){
            if(this.state.commentsViewAll){
                userComments = this.state.comments.map((comment, index) => {
                    return <CommentRow comment={comment} handleDeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser} key={comment._id} index={index}/>
                })
            }
            else{
                userComments = this.state.comments.slice(0,5).map((comment, index) => {
                    return <CommentRow comment={comment} handleDeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser} key={comment._id} index={index}/>
                })
            }
            
        }
        this.state.commentsViewAll ? commentViewAction = 'Collapse comments' : commentViewAction = 'View all comments'

        return(
            <section>
                <CommentBox handleAddComment={this.handleAddComment} urlParams={this.props.urlParams}/>
                <div>
                    <div style={{height: '400px', 'overflow': 'auto'}}>
                        {userComments}
                    </div>
                </div> 
                <a href="/viewallcomments" onClick={this.handleClickViewAll}>{commentViewAction}</a>
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