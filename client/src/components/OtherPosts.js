import React from 'react';
import { Link } from 'react-router-dom';
 
const OtherPosts = (props) => {
    
    const imgSrcLink = `/user/${props.username}/${props.post.post_id}`;
    
    return(
        <div className='other-post' key={props.post.post_id}>
            <Link to={imgSrcLink}>
                <img src={props.post.image} alt='Other posts for this user' className='other-post__image' />
            </Link>
        </div>
    )
}

export default OtherPosts;