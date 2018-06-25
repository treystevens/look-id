import React, { Component } from 'react';


class UserProfileHead extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <section>
                <section style={{margin: '0 auto', width: '40%'}}>
                    <img src='/' className='profileAvi' style={{width: '100px', height: '100px'}}/>
                    <span>Followers</span>
                    <span>Following</span>
                    <span>Life is what you make it</span>
                    <a href="wherehouse.com">wherehouse.com</a>
                </section>
                <a href="/profile/upload">Post a new photo</a>
            </section>
        )
    }
}


export default UserProfileHead;