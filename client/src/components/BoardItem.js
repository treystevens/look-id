import React, { Component } from 'react';


const BoardItem = (props) => {



    console.log(props)

    let boardLink = `/user/${props.boardInfo.user}/boards/${props.boardInfo.board_id}`
    let backgroundImg = props.boardInfo.board_display_image;

    return(
        
        
         <div className="board">
            <a href={boardLink}>
                <div className="boardImg" style={ { backgroundImage:`url(${backgroundImg}`} }data-board-id={props.boardInfo.board_id}></div>
                <h1>{props.boardInfo.board_name}</h1>
            </a>
        </div>
    )
}



export default BoardItem;