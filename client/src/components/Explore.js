import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import Avatar from './Avatar';


class Explore extends Component{
    constructor(props){
        super(props);

        this.state = {
            userProfileHead: {},
            streamData: []
        };
    }


    componentDidMount(){

        
        const serverResponse = getData(`/stream/explore`);


        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {


            const userProfileHeadData = {
                username: data.stream.username,
                
            };

            const streamUserData = {
                posts: data.stream
            };

            console.log(data);
            // For Outputting posts

            this.setState({
                userProfileHead: userProfileHeadData,
                streamData: streamUserData
            }, () => {
                console.log(this.state)
            });

        })
        .catch((err) => {
            console.log(err);
        });


    }


      
    render(){
        
        console.log(this.state)
        return(
            <section>
                <PageHead pageHead='Explore' />
                <Stream sourceFetch='explore' urlParams={this.state.userProfileHead.username} data={this.state.streamData}/>
            </section>
        )
    }
}


export default Explore