import React from 'react';
import { Link } from 'react-router-dom';


const OtherPosts = (props) => {
    
    const imgSrcLink = `/user/${props.username}/${props.post.post_id}`;
    
    return(
        <div className='other-post'>
            <a href={imgSrcLink}>
                <img src={props.post.image} alt='Other posts for this user' className='other-post__image' />
            </a>
        </div>
    )
}

export default OtherPosts;