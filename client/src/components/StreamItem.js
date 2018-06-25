import React from 'react';

/* jshint ignore:start */


const StreamItem = (props) => {
    let profileSrc = `/user/${props.stream.username}`;
    let imgSrcLink = `/user/${props.stream.username}/${props.stream.post.image_id}`;
    let imgSrc = `${props.stream.post.image}`;

    return(
        <div className="testMore">
            {props.usernameHeader && 
            <h4><a href={profileSrc}>{props.stream.username}</a></h4>
            }
            <a href={imgSrcLink}>
                <img src={imgSrc} alt="outfit"/>
            </a>
        </div>
    )
}


export default StreamItem;


// Code here will be ignored by JSHint.
/* jshint ignore:end */