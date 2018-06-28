import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';



class Profile extends Component{
    constructor(props){
        super(props);
    }

    // componentDidMount(){
    //     fetch('/profile', {
    //         method: 'GET',
    //         credentials: 'same-origin' 

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
        console.log(this.props.isAuth);


        if(this.props.isAuth == undefined || this.props.isAuth == false){
            console.log(this.props.isAuth, `is the authroization`)
            return <Redirect to="/login"/>
        }


        return(
            <section>
                <PageHead pageHead='Profile'/>
                <UserProfileHead />
                <Stream sourceFetch='profile'/>
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
      isAuth: state.isAuth,
      username: state.username,
      userID: state.userID
    };
}

export default connect(mapStateToProps)(Profile);