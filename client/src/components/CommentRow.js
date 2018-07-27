import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const CommentRow = (props) => {

    const username = props.comment._user.username;

    let authorizedUser;
    let viewingUserAuth;
    let avatar;


    if(props.comment._user.profile.avatar){
        avatar = props.comment._user.profile.avatar;
    }

    // User visiting a post where that they commented on
    if(props.viewingUser === props.comment._user.username){
        viewingUserAuth = true;
    }

    // If the user is viewing their own profile 
    if(props.urlParams.username === props.username && viewingUserAuth !== true){
        authorizedUser = true;
    }

    // Passing the index and keyID up a component
    function deleteComment(evt){
        let keyID = evt.target.getAttribute('data-item-id');
        props.handleDeleteComment(props.index, keyID);
    }


    return(
        <div className="comment-row" style={{width: '100%'}}>

        <Link to={`/user/${props.comment.username}`}>
            <Avatar avatar={avatar} username={props.comment.username} />
        </Link>

            <div>
                <div className="user-data">
                    <Link to={`/user/${username}`}>
                        <span>{username}</span>
                    </Link>
                    <span style={{color: "gray", fontSize: ".5rem"}}>{props.comment.date_posted}</span>
                </div>

                <div className="user-comment">
                    <p>{props.comment.comment}</p>
                </div>

                { authorizedUser &&
                    <div className="delete-comment" style={{color: "red"}} onClick={deleteComment} data-item-id={props.comment._id}>Delete Comment!
                    </div>
                }

                { viewingUserAuth &&
                    <div className="delete-comment" style={{color: "red"}} onClick={deleteComment} data-item-id={props.comment._id}>Delete Comment!
                    </div>
                }
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