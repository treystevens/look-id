import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import Avatar from './Avatar';


class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            avatarURl: '',
            followers: '',
            following: ''
        };
    }


      
    render(){
        let user = this.props.urlParams.match.params.user;

        return(
            <section>
                <PageHead pageHead='Profile'/>
                <UserProfileHead urlParams={user}/>
                <Stream sourceFetch='profile'/>
            </section>
        )
    }
}


export default Profile