import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead'



class Profile extends Component{
      
    render(){
        return(
            <section>
                <PageHead pageHead='Profile'/>
                <UserProfileHead />
                <Stream sourceFetch='profile'/>
            </section>
        )
    }
}

export default Profile;