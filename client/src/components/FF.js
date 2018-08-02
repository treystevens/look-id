import React, { Component } from 'react';
import Avatar from './Avatar';
import PageHead from './PageHead';
import FollowButton from './FollowButton';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './FF.css';
 
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
                        <div className='ff-container' key={user._id}>
                            <div className='ff-user'>
                                <Link to= {`/user/${user.username}`}>
                                <Avatar avatar={user.profile.avatar} username={user.username}  addClass='avatar-container--small'/></Link>
                                <span className='ff-user__username'>{user.username}</span>
                            </div>

                            {this.props.username !== user.username &&
                                <FollowButton user={user.username} iFollow={user.iFollow} followAction={this.props.followAction} index={index} handleRemoveFollowing={this.handleRemoveFollowing} urlParamUser={this.props.urlParamUser} myUsername={this.props.username} handleFollowingCount={this.props.handleFollowingCount}/>
                            }
                        </div>
                )
            })
        }    

        return(
                <section className='container'>
                    <PageHead pageHead={this.props.followAction}/>
                    {users}
                </section>
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