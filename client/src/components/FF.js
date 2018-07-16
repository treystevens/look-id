import React, { Component } from 'react';
import { getData } from '../util/serverFetch';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import PageHead from './PageHead';
import FollowButton from './FollowButton';
import { connect } from 'react-redux';
 
class FF extends Component{

    constructor(props){
        super(props); 

        this.state = {
            users: [],
        };

        this.handleRemoveFollowing = this.handleRemoveFollowing.bind(this);
    }
        
    componentDidMount(){

        const urlParamUser = this.props.urlParamUser;
        const followAction = this.props.followAction.toLowerCase();
        
        const serverResponse = getData(`/user/${urlParamUser}/ff/${followAction}`);
 
        serverResponse
        .then(response => response.json())
        .then((data) => {
            
            this.setState({
                users: data.ff
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }    

    // Remove one from 'Following' when clicking on FollowButton component
    handleRemoveFollowing(index){
        this.setState({ 
            users: this.state.users.filter( (user, userIndex) => index !== userIndex) 
        });
    }

    render(){
        
        let users;
        
        if(this.state.users.length > 0){
        
            users = this.state.users.map((user, index) => {
                return(
                        <section key={user._id}>
                            <Link to= {`/user/${user.username}`}>
                            <Avatar avatar={user.profile.avatar} username={user.username}/></Link>
                            <span>{user.username}</span>

                            {this.props.username !== user.username &&
                                <FollowButton user={user.username} iFollow={user.iFollow} followAction={this.props.followAction} index={index} handleRemoveFollowing={this.handleRemoveFollowing} urlParamUser={this.props.urlParamUser} myUsername={this.props.username} handleFollowingCount={this.props.handleFollowingCount}/>
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