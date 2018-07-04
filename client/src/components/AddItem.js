import React from 'react';


const AddItem = (props) => {

    return(
        
        <div>
            <div className="boardBox" onClick={props.handleAddItem}>
                <div className="addContainer">
                    <div className="stickOne"></div>
                    <div className="stickTwo"></div>
                    <h1>Add Item</h1>
                </div>
            </div>
            
        </div>
        
    )
}


export default AddItem;