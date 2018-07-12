import React from 'react';
import Boards from './Boards';
import BoardModal from './BoardModal';
import AccountVerify from './AccountVerify';
import FF from './FF';


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

    if(props.source === 'ff'){
        shownContent = <FF urlParamUser={props.urlParamUser} followAction={props.followAction}/>
        
    }
    // if(props.source === 'addPostToBoard'){
    //     let shownContent = <showBoards />
    // }
    

    return(
        <div className="modal" onClick={props.closeModal} onKeyDown={props.escCloseModal}>
            <div className="modal-content">
                {shownContent}
            </div>
        </div>
    )
}

export default Modal;

