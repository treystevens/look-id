import React from 'react';


const CreateBoard = (props) => {

    return(
        <div>
            <div className="boardBox" onClick={props.handleClickCreateBoard}>
                <div className="addContainer">
                    <div className="stickOne"></div>
                    <div className="stickTwo"></div>
                </div>
            </div>
            <h1>Create New Board</h1>
        </div>
    )
}


export default CreateBoard;