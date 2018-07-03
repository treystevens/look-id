import React, { Component } from 'react';
import { getData } from '../util/serverFetch';
import Avatar from './Avatar';

class FF extends Component{

    constructor(props){
        super(props); 

        this.state = {
            users: []
        };
    }
        
    componentDidMount(){



        const serverResponse = getData('/profile/followers');

        serverResponse(response => response.json())
        .then((data) => {
            let newData = this.state.users.concat(data.following);

            this.setState({
                users: newData
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }    



    render(){

        
        let users = this.state.users.map((person) => {
            return(

                
                    <section>
                        <Avatar avatarUrl={person.avatar} />
                        <span>{person.username}</span>
                            {this.props.following && 
                                <span>Unfollow</span>
                            }
                            {this.props.following && 
                                <span>Following</span>
                            }
                    </section>
                
            )

        })

        

        

        return(
                {users}

        )


    }
}


export default FF;