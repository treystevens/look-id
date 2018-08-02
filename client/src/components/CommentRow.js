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
    if(props.viewingUser === username){
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
        <div className='comment__row'>

        <Link to={`/user/${username}`}>
            <Avatar avatar={avatar} username={username} addClass='avatar-container--small'/>
        </Link>

            <div className='comment__user-comment'>
                <div className='user-data'>
                    <Link to={`/user/${username}`}>
                        <span>{username}</span>
                    </Link>
                    <span className='comment__date'>{props.comment.date_posted}</span>
                </div>

                <div className='user-comment'>
                    <p>{props.comment.comment}</p>
                </div>
            </div>
            <div className='comment__delete'>
                { authorizedUser &&
                    <div className='comment__delete-btn' onClick={deleteComment} data-item-id={props.comment._id}>X
                    </div>
                }

                { viewingUserAuth &&
                    <div className='comment__delete-btn' onClick={deleteComment} data-item-id={props.comment._id}>X
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