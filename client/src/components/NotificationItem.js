import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


const NotificationItem = (props) => {


    console.log(props)
    const { action, _user:user, _post: post, comment } = props.notification;
    let displayText;
    let hasPost = true;
    let hasComment = true;


    if(!post) hasPost = false;
    if(!comment) hasComment = false;
    if(action === 'WELCOME') return (
        <div>
                <p>{comment}</p>
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
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Link to={`/user/${user.username}`}>
                <Avatar avatar={user.profile.avatar} username={user.username}/>
            </Link>
            <div>
                <p>{displayText}</p>
                {hasComment &&
                <p>{comment}</p>}
            </div>


                {hasPost && 
                    <div style={{width: '80px', height: '80px'}}>
                        <Link to={`/user/${props.username}/${post.post_id}`}>
                            <img src={`${post.image}`} alt={`${props.username}'s post.`}  style={{width: '100%'}}/>
                        </Link>
                    </div>
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