import React, { Component } from 'react';
import { getData } from '../util/serverFetch';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import PageHead from './PageHead';
import {ShowButton} from './buttons/Buttons';
import FollowButton from './FollowButton';
import { connect } from 'react-redux';
 
class FF extends Component{

    constructor(props){
        super(props); 

        this.state = {
            users: [],
        };
    }
        
    componentDidMount(){

        const urlParamUser = this.props.urlParamUser;
        const followAction = this.props.followAction.toLowerCase();

        // const serverResponse = getData(`/user/${urlUser}/ff/${followAction}`);
        
        const serverResponse = getData(`/user/${urlParamUser}/ff/${followAction}`);

        
        serverResponse
        .then(response => response.json())
        .then((data) => {
            let newData = this.state.users.concat(data.following);

            console.log(data);
            this.setState({
                users: data.ff
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }    



    render(){
        
        let users;
        let showFollowButton = true;

        // Checking to see if requested user is the same user logged in viewing their own profile
        // If so, include upload post feature, remove follow button
        if(this.props.urlParamUser === this.props.username){
            showFollowButton = false;
        }



        console.log(this.state.users)
        if(this.state.users.length > 0){

        
            users = this.state.users.map((user) => {
                console.log(user)
                return(
                        <section key={user._id}>
                            <Link to= {`/user/${user.username}`}>
                            <Avatar avatar={user.profile.avatar} username={user.username}/></Link>
                            <span>{user.username}</span>

                            {this.props.username !== user.username &&
                                <FollowButton followText='Following' username={user.username} iFollow={user.iFollow}/>
                            }
                            
                            
                        </section>
                    
                )
    
            })
        }    

        

        return(
                <div>
                    <PageHead pageHead={this.props.followAction}/>
                    {users}
                </div>

        )


    }
}


function mapStateToProps(state) {
    return {
      username: state.username,
      isAuth: state.isAuth
    };
}

export default connect(mapStateToProps)(FF);