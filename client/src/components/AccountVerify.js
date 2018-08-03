import React from 'react';
import Button from './Button';


const AccountVerify = (props) => {

    let verifyClass = 'auth-verify';
    if(props.noModal) verifyClass = 'auth-verify--inline';

    return(
        <div className={verifyClass}>
            <a href="/login">
                <Button dummy={true} text='Login' addClass='auth-btn'/>
            </a>
            <a href="/signup">
                <Button dummy={true} text='Sign Up' addClass='auth-btn'/>
            </a>
        </div>
    )
}

export default AccountVerify;