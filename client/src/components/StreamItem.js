import React from 'react';
import { Link } from 'react-router-dom';

/* jshint ignore:start */


const StreamItem = (props) => {

    console.log(props)
    let profileSrc = `/user/${props.username}`;
    let postLink = `/user/${props.username}/${props.stream.post_id}`;
    let imgSrc = `${props.stream.image}`;

    return(
        <div className="testMore">
            {props.usernameHeader && 
            <h4><Link to={profileSrc}>{props.username}</Link></h4>
            }
            <Link to={postLink}>
                <img src={imgSrc} alt="outfit"/>
            </Link>
        </div>
    )
}


export default StreamItem;


// Code here will be ignored by JSHint.
/* jshint ignore:end */