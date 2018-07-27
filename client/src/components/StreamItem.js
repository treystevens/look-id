import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';


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
        post = (
        <img className='post__image' onClick={handleEdit.bind(this, {...props})} src={imgSrc} alt={`${username}'s outfit.'`}/>)
    }
    else{
        post = (<Link to={postLink}>
                    <img className='post__image' src={imgSrc} alt={`${username}'s outfit.'`}/>
                </Link>)
    }

    return(
        <div className='testMore'>
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
    
    target.classList.toggle('post__image--edit')

    props.handlePostDelete(post, target)
    
}

export default StreamItem;


