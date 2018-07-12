import React, { Component } from 'react';
import { getData } from '../util/serverFetch';


const Avatar = (props) => {

    let imgAlt = `${props.username}'s profile picture'`;
    

    return(
        <div style={{width: '80px', height: '80px', borderRadius: '50%', overflow:'hidden'}}>
            <img src={props.avatar} alt={imgAlt} className='avatar' style={{width: '100%'}}/>
        </div>
    )
}

export default Avatar;

