import React from 'react';
import PageHead from './PageHead';

const Settings = (props) => {
    return(
        <section >
            <PageHead pageHead='Settings' />
            <a href="/profile/settings/change-password" style={{display: 'block'}}>Change Password</a>
            <a href="/profile/settings/delete" style={{display: 'block'}}>Delete Account</a>
        </section>
    )
}


export default Settings