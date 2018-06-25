import React from 'react';

const CommentRow = (props) => {


    function deleteThis(evt){
        // Make sure you go the server to delete the message in the server

    

        let target = evt.target.parentElement.childNodes[1].textContent;
        
        props.deleteComment(target)
    }

    // Need for the user of the post to be able to delete any comment
    // Need for you to be able to delete your own comment
    // Make a comment id of the user name and comment date time like "jnowlem" -> j2149m for comment id and store that on the delete comment as an attribute

    return(
        <div className="comment-row" style={{width: '100%'}}>
            {/* <figure> */}
                <img className="user-avatar" src={props.comment.display_picture}/>
            {/* </figure>   */}
            <div>
                <div className="user-data">
                    <span>{props.comment.username} </span>
                    <span style={{color: "gray", fontSize: ".5rem"}}>{props.comment.date_posted}</span>
                </div>
                <div className="user-comment">
                    <p>{props.comment.comment}</p>
                </div>
                <div className="delete-comment" style={{color: "red"}} onClick={deleteThis}>Delete Comment!</div>
            </div>

        </div>
    )
}

export default CommentRow;