import React from 'react';


const CreateItem = (props) => {

    return(
        
        <div>
            <div className="boardBox" onClick={props.handleCreateItem}>
                <div className="addContainer">
                    <div className="stickOne"></div>
                    <div className="stickTwo"></div>
                    <h1>Add Item</h1>
                </div>
            </div>
            
        </div>
        
    )
}


export default CreateItem;