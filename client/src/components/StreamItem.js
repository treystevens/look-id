import React from 'react';
import { Link } from 'react-router-dom';

/* jshint ignore:start */


const StreamItem = (props) => {
    let profileSrc = `/user/${props.stream.username}`;
    let imgSrcLink = `/user/${props.stream.username}/${props.stream.post.image_id}`;
    let imgSrc = `${props.stream.post.image}`;

    return(
        <div className="testMore">
            {props.usernameHeader && 
            <h4><Link to={profileSrc}>{props.stream.username}</Link></h4>
            }
            <Link to={imgSrcLink}>
                <img src={imgSrc} alt="outfit"/>
            </Link>
        </div>
    )
}


export default StreamItem;


// Code here will be ignored by JSHint.
/* jshint ignore:end */