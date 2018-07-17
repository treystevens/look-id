import React from 'react';
import { Link } from 'react-router-dom';

const StreamItem = (props) => {

    const username = props.post.username;
    const postID = props.post.post_id;
    const postImage = props.post.image;
    const profileSrc = `/user/${username}`;
    const postLink = `/user/${username}/${postID}`;
    const imgSrc = `${postImage}`;

    return(
        <div className="testMore">
            {props.usernameHeader && 
            <h4><Link to={profileSrc}>{username}</Link></h4>
            }
            <Link to={postLink}>
                <img src={imgSrc} alt={`${username}'s outfit.'`}/>
            </Link>
        </div>
    )
}

export default StreamItem;


