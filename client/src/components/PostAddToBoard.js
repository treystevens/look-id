import React from 'react';

function addPost(evt){
    // Save the picture to the database, make a fetch request
    // console.log(evt);
    console.log(`added the photo`);
}

const AddToBoard = (props) => {

    let backgroundImg = props.boardInfo.board_display_image;

    return(
        
        
         <div className="board" onClick={addPost}>
                <div className="boardImg" style={ { backgroundImage:`url(${backgroundImg}`} }data-board-id={props.boardInfo.board_id}></div>
                <h1>{props.boardInfo.board_name}</h1>
        </div>
    )
}

export default AddToBoard;