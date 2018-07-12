import React, { Component } from 'react';
import { getData } from '../util/serverFetch';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import PageHead from './PageHead';
import {ShowButton} from './buttons/Buttons';
import FollowButton from './FollowButton';

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
        const followAction = this.props.followAction.toLowerCase();
        const followText = this.props.followAction;




        console.log(this.state.users)
        if(this.state.users.followers || this.state.users.following){

        
            users = this.state.users[followAction].map((user) => {
                console.log(user)
                return(
                        <section key={`li-${user.username}`}>
                            <a href={`/user/${user.username}`}>
                            <Avatar avatar={user.avatar} username={user.username}/></a>
                            <span>{user.username}</span>
                            {user.iFollow ? (
                                <FollowButton text='Following' userAvatar={user.avatar} username={user.username}/>
                            ) : (
                                <FollowButton text='Follow' userAvatar={user.avatar} username={user.username}/>
                            )}
                            
                            
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




export default FF;