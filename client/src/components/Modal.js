import React from 'react';
import Boards from './Boards';
import BoardModal from './BoardModal';
import AccountVerify from './AccountVerify';
import FF from './FF';
import Button from './Button';
import './Modal.css';


const Modal = (props) => {

    let shownContent;
    let modalContentClass = 'modal-content';
    if(props.addClass) modalContentClass += ` ${props.addClass}`;

    if(props.source === 'createBoard'){
        shownContent = <BoardModal />
    }

    if(props.source === 'accountVerify'){
        modalContentClass += ' modal-content--small';
        shownContent = <AccountVerify />
    }

    if(props.source === 'addToBoard'){
        shownContent = <Boards addToBoard={true} urlParams={props.urlParams} instructions={true}/>
    }

    if(props.source === 'ff'){
        shownContent = <FF urlParamUser={props.urlParamUser} followAction={props.followAction} handleFollowingCount={props.handleFollowingCount}/>
    }

    return(
        <div className='modal' onClick={props.closeModal}>
            <div className={modalContentClass}>
                <Button dummy='true' text='Close x' addClass='btn__close--modal' onClick={props.closeModal}/>
                <div className='modal-overflow-content'>
                    {shownContent}
                </div>
            </div>
        </div>
    )
}

export default Modal;

