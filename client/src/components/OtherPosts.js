import React from 'react';


const OtherPosts = (props) => {
    
    const imgSrcLink = `/user/${props.username}/${props.post.post_id}`;
    
    return(
        <a href={imgSrcLink}>
            <img src={props.post.image} alt='Other posts for this user' style={{'width': '100%'}}/>
        </a>
    )
}

export default OtherPosts;