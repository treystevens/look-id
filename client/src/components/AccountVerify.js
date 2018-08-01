import React from 'react';
import Button from './Button';


const AccountVerify = () => {


    return(
        <div className='auth-verify'>
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