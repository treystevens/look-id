import React from 'react';
import './ConfirmAction.css';


const ConfirmAction = (props) => {

    let statusClass;

    props.actionSuccess ? statusClass = 'confirm-action--success' : statusClass = 'confirm-action--fail'
    
    if(props.absolute) statusClass += ' confirm-action--absolute';
    
    return(
        <div className={statusClass}>
            {props.statusMessage}
        </div>
    )
};


export default ConfirmAction;