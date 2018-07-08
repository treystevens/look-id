import React, { Component } from 'react';
import CommentBox from './CommentBox';
import CommentRow from './CommentRow';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
// import Notifications from './Notifications';



class Comments extends Component{
    constructor(props){
        super(props);
        this.state = {
            comments: [],
            shownComments: []
            
        };

        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
    }

    handleAddComment(newComment){


        console.log(newComment)
    

        // If I want the comment on the bottom of the list
        let updatedStateComment = [...this.state.comments].concat(newComment);

        // If I want the comment on the top of the list
        // let updatedStateComment = [newComment].concat(this.state.comments);

        
        {/* <Notifications notifications={addedNewComment}> */}

        // let updatedStateComment = this.state.comments.concat(addedNewComment)
        // this.state.comments.unshift(addedNewComment)
        // let updatedStateComment = this.state.comments
        
        this.setState({
            comments: updatedStateComment
        }, () => {
            console.log(this.state.comments);
        });


    }
    


    handleDeleteComment(comment){

        let currentState = this.state.comments;

        let updatedStateComment = currentState.filter((item) => {
            console.log(item);
            if(item.comment != comment){
                console.log(`does not equal`);
                return item;
            }
        });


        console.log('Delete');
        // Filter through array to remove the comment aargument

        this.setState({
            comments: updatedStateComment
        });
    }

    // Component will mount might need to get some authentication from the server if I'm trying to post a comment


    componentDidMount(){
        // let sendToCommentBox = {
        //     comment_amount: user1.comments.amount,
        //     comment_messages: user1.comments.messages,
        // }

        const urlPageUsername = this.props.urlParams.username;
        const urlPagePostID = this.props.urlParams.postID;

        const serverResponse = getData(`/comment/${urlPageUsername}/${urlPagePostID}`);
        
        serverResponse.then( response => response.json())
        .then((data) => {
            console.log(data);


            let viewingUser = this.props.username || false;




            // Store the user from the redux of the current user -> Pass the user into comment row -> Check if the comment.user from map inside CommentRow component matches the imUser variable here that is from the redux -> 

            let userComments = data.comments.map((comment) => {
                return <CommentRow comment={comment} handledeleteComment={this.handleDeleteComment} urlParams={this.props.urlParams} viewingUser={viewingUser}/>
            })
    
    
            this.setState({
                comments: userComments
            })
        })
        .catch((err) => {
            console.log(err);
        });

        // When this component mounts we just want to take the comments from the POST componenet because we will be passing in the props from there
        console.log(this.props);

        let comments = this.state.comments;

        // Structure of comment
        // let addedNewComment = {
        //     username: this.props.username, // get from auth token I guess...from cookie?
        //     postID: '0201',
        //     date_posted: date,
        //     comment: newComment,
        //     avatar: '/lookid/fit6.jpg'
        // };




        
    }


    render(){
        console.log(this.state)
        return(
            <div>
                <CommentBox handleAddComment={this.handleAddComment} urlParams={this.props.urlParams}/>
                {/* {this.state.shownComments} */}
                <div>
                </div>
                <div>
                    <div>
                        {this.state.comments}
                    </div>
                    <a href="/viewallcomments">View all comments</a>
                </div> 
                
                {/* <CommentRow /> */}
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