import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead';



class Profile extends Component{
    constructor(props){
        super(props);
    }

    // componentDidMount(){
    //     fetch('/profile', {
    //         method: 'GET',
    //         credentials: 'include' 

    //     })
    //     .then((response) => {
    //         return response.json()
    //     })
    //     .then((data) => {
    //         if(data.redirect){
    //             this.setState({
    //                 redirect: true
    //             });
    //         }
    //         console.log(data)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })

    //     // console.log('mounted in profile')

    // }
      
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


export default Profile