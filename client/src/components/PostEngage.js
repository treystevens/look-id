import React from 'react';



function focusComment(){
    let commentBox = document.querySelector('.comment__box');
    commentBox.focus();
    commentBox.scrollIntoView();
}

const PostEngage = (props) => {
    // Click on the heart make sure to update the user that I click on notifications..with a fetch to the server and put the new data in
    console.log(props)
    
    return(
        <div>
            <img src="/icons/like.png" style={ {"width": "50px"}} onClick={props.handleLikeCount}/>
                <span>{props.likeCount}</span>
            <img src="/icons/comment.png" style={ {"width": "50px"}} onClick={focusComment}/>
                {/* <span>{props.commentCount}</span> */}
            <img src="/icons/plus.png" style={ {"width": "50px"}} onClick={props.openBoards}/>
        </div>
    )
}

export default PostEngage;