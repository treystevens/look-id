import React from 'react';
import PageHead from './PageHead';
import { Link } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
    return(
        <section className='container'>
            <PageHead pageHead='Settings' />
            <div className='settings-container'>
                <Link to="/profile/settings/change-password" className='profile__setting'>Change Password</Link>
                <Link to="/profile/settings/delete" className='profile__setting' >Delete Account</Link>
            </div>
        </section>
    )
}


export default Settings