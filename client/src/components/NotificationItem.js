import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Notifications.css';


const NotificationItem = (props) => {


    const { action, _user:user, _post: post, comment } = props.notification;
    let displayText;
    let hasPost = true;
    let hasComment = true;


    if(!post) hasPost = false;
    if(!comment) hasComment = false;
    if(action === 'WELCOME') return (
        <div className='notification-container'>
                <h3>{comment}</h3>
        </div>
    )

    switch (action) {
        case 'LIKE':
            displayText = `${user.username} liked your post.`;
            break;
        case 'COMMENT':
            displayText = `${user.username} commented on your post:`;
            break;
        case 'FOLLOW':
            displayText = `${user.username} now follows you.`;
            break;
        default:
            break;
    }



    return(
        <div className='notification-container'>
            <div className='notification__user'>
                <Link to={`/user/${user.username}`}>
                    <Avatar avatar={user.profile.avatar} username={user.username} addClass='avatar-container--small'/>
                </Link>
                <div className='notification__message'>
                    <p className='notification__action'>{displayText}</p>

                    {hasComment &&
                        <p className='notification__comment'>{comment}</p>
                    }
                </div>
            </div>


                {hasPost && 
                    
                        <Link to={`/user/${props.username}/${post.post_id}`} className='notification-container__image'>
                            <div className='notification__image' style={ { backgroundImage:`url(${post.image}`} }>
                            </div>

                        
                        </Link>
                    
                }
        </div>
    )

};

function mapStateToProps(state){
    return{
        username: state.username
    }
}

export default connect(mapStateToProps)(NotificationItem);