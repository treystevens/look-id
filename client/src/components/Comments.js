import React, { Component } from 'react';
import CommentBox from './CommentBox';
import CommentRow from './CommentRow';
import { getData, sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';
// import Notifications from './Notifications';



class Comments extends Component{
    constructor(props){
        super(props);
        this.state = {
            comments: [],
            shownComments: [],
            commentsViewAll: false
            
        };

        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.handleClickViewAll = this.handleClickViewAll.bind(this);
        this.getInitialComments = this.getInitialComments.bind(this);
        this.showAllComments = this.showAllComments.bind(this);
    }

    getInitialComments(){
        const urlPageUsername = this.props.urlParams.username;
        const urlPagePostID = this.props.urlParams.postID;

        const serverResponse = getData(`/comment/${urlPageUsername}/${urlPagePostID}`);
        
        serverResponse.then( response => response.json())
        .then((data) => {
            console.log(data);


            let viewingUser = this.props.username || false;


            let userComments = data.comments.map((comment) => {
                return <CommentRow comment={comment} handleDeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser} key={comment._id} />
            })
    
    
            this.setState({
                comments: userComments
            })
        })
        .catch((err) => {
            console.log(err);
        });
    }

    showAllComments(){
        const urlPageUsername = this.props.urlParams.username;
        const urlPagePostID = this.props.urlParams.postID;

        const serverResponse = getData(`/comment/${urlPageUsername}/${urlPagePostID}/viewall`);
        
        serverResponse.then( response => response.json())
        .then((data) => {
            console.log(data);

            let viewingUser = this.props.username || false;

            let userComments = data.comments.map((comment) => {
                return <CommentRow comment={comment} handleDeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser} key={comment._id} />
            })
    
    
            this.setState({
                comments: userComments
            })
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleClickViewAll(evt) {
        evt.preventDefault();

        let view;

        // Mimic toggle
        this.state.commentsViewAll ? view = false : view = true


        this.setState({
            commentsViewAll: view
        }, () => {
            this.state.commentsViewAll ? this.showAllComments() : this.getInitialComments();
        })
    
    }


    handleAddComment(newComment){

        let viewingUser = this.props.username || false;
        let userComments = [newComment].map((comment) => {
            return <CommentRow comment={comment} handleDeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser} key={comment._id} />
        })

        this.setState({
            comments: this.state.comments.concat(userComments)
        });
    }
    

    handleDeleteComment(componentKeyID){

        let currentState = this.state.comments;
        let updatedStateComment = currentState.filter((item) => {
            if(item.key != componentKeyID){
                return item;
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

    componentDidMount(){
        // let sendToCommentBox = {
        //     comment_amount: user1.comments.amount,
        //     comment_messages: user1.comments.messages,
        // }

        this.getInitialComments();
        
        
    }


    render(){

        let commentViewAction;

        this.state.commentsViewAll ? commentViewAction = 'Collapse comments' : commentViewAction = 'View all comments'

        return(
            <div>
                <CommentBox handleAddComment={this.handleAddComment} urlParams={this.props.urlParams}/>
                <div>
                    <div>
                        {this.state.comments}
                    </div>
                    <a href="/viewallcomments" onClick={this.handleClickViewAll}>{commentViewAction}</a>
                </div> 
            </div>
            
        )
    }
}

function mapStateToProps(state){
    return{
        username: state.username
    }
}

export default connect(mapStateToProps)(Comments);