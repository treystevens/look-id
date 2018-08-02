import React from 'react';
import { Link } from 'react-router-dom';


const StreamItem = (props) => {

    const username = props.post.username;
    const postID = props.post.post_id;
    const postImage = props.post.image;
    const profileSrc = `/user/${username}`;
    const postLink = `/user/${username}/${postID}`;
    const imgSrc = `${postImage}`;
    let post;

    // Create edit options for an individual post 'EditBoard' functionality to delete post
    if(props.edit){
        post = (<div className='stream__image-container'>
        <img className='stream__image' onClick={handleEdit.bind(this, {...props})} src={imgSrc} alt={`${username}'s outfit.'`}/>
        </div>)
    }
    else{
        post = (<Link to={postLink}>
                    <img className='stream__image' src={imgSrc} alt={`${username}'s outfit.'`}/>
                </Link>)
    }

    return(
        <div className='stream__item'>
            {props.usernameHeader && 
            <h4><Link to={profileSrc}>{username}</Link></h4>
            }
            {post}
            
        </div>
    )
}

// Toggle class to handle edit when inside 'EditBoard' Component
function handleEdit(props, evt){

    const target = evt.target;
    const postID = props.post._id
    const postImg = props.post.image

    const post = {
        postID: postID,
        postImg: postImg
    }
    
    target.parentElement.classList.toggle('stream__image-container--picked')
    target.classList.toggle('stream__image--edit')

    props.handlePostDelete(post, target)
    
}

export default StreamItem;


