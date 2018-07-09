import React from 'react';
import Boards from './Boards';
import BoardModal from './BoardModal';
import AccountVerify from './AccountVerify';


const Modal = (props) => {
    let shownContent;

    // If props is for creating a new board have an element that equals BoardModal, if the modal is coming from popping up when you add a post to a modal do a different example below
    if(props.source === 'createBoard'){
        shownContent = <BoardModal />
    }

    if(props.source === 'accountVerify'){
        shownContent = <AccountVerify />
    }

    if(props.source === 'addToBoard'){
        shownContent = <Boards addToBoard={true} urlParams={props.urlParams}/>
        
    }
    // if(props.source === 'addPostToBoard'){
    //     let shownContent = <showBoards />
    // }
    

    return(
        <div className="modal" onClick={props.closeModal}>
            <div className="modal-content">
                {shownContent}
            </div>
        </div>
    )
}

export default Modal;