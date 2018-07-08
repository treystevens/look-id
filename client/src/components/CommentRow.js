import React from 'react';
import { connect } from 'react-redux';

const CommentRow = (props) => {

    let authorizedUser;
    let viewingUserAuth;

    console.log(props, `these are the prooooops dawg`);



    if(props.viewingUser === props.comment.username){
        viewingUserAuth = true;
    }

    if(props.urlParams.username === props.username){
        authorizedUser = true;
    }

    
    function deleteThis(evt){
        // Make sure you go the server to delete the message in the server
        let target = evt.target.parentElement.childNodes[1].textContent;
        
        props.deleteComment(target);
    }



    // Need for the user of the post to be able to delete any comment
    // Need for you to be able to delete your own comment
    // Make a comment id of the user name and comment date time like "jnowlem" -> j2149m for comment id and store that on the delete comment as an attribute

    return(
        <div className="comment-row" style={{width: '100%'}}>
                <img className="user-avatar" src={props.comment.avatar}/>
            <div>
                <div className="user-data">
                    <span>{props.comment.username} </span>
                    <span style={{color: "gray", fontSize: ".5rem"}}>{props.comment.date_posted}</span>
                </div>
                <div className="user-comment">
                    <p>{props.comment.comment}</p>
                </div>
                { authorizedUser &&
                <div className="delete-comment" style={{color: "red"}} onClick={deleteThis}>Delete Comment!</div>}
                { viewingUserAuth &&
                <div className="delete-comment" style={{color: "red"}} onClick={deleteThis}>Delete Comment!</div>}
            </div>

        </div>
    )
}

function mapStateToProps(state){
    return {
        isAuth: state.isAuth,
        username: state.username
    }
}

export default connect(mapStateToProps)(CommentRow);