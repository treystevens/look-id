import React from 'react';
import './Avatar.css';


const Avatar = (props) => {

    let imgAlt = `${props.username}'s profile picture'`;
    let avatarContainer = 'avatar-container  up-avatar';
    if(props.addClass) avatarContainer += ` ${props.addClass}`;

    return(
        <div className={avatarContainer}>
            <img src={props.avatar} alt={imgAlt} className='avatar'/>
        </div>
    )
}

export default Avatar;

