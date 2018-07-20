import React from 'react';


const ConfirmAction = (props) => {

    let statusClass;

    props.actionSuccess ? statusClass = 'confirm-action--success' : statusClass = 'confirm-action--fail'

    
    return(
        <div className={statusClass}>
            {props.statusMessage}
        </div>
    )
};


export default ConfirmAction;