import React from 'react';


const BoardModal = (props) => {


    return(
        <form className="create-board">
            <label>Board Name:
                <input type="text" name="new-board" />
            </label>
            <input type="button" value="Cancel" />
            <button>Create Board</button>
        </form>
    )
}

export default BoardModal;