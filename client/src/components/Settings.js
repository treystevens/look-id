import React from 'react';
import PageHead from './PageHead';
import { Link } from 'react-router-dom';

const Settings = (props) => {
    return(
        <section >
            <PageHead pageHead='Settings' />
            <Link to="/profile/settings/change-password" style={{display: 'block'}}>Change Password</Link>
            <Link to="/profile/settings/delete" style={{display: 'block'}}>Delete Account</Link>
        </section>
    )
}


export default Settings