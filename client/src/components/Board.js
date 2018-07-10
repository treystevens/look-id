import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData } from '../util/serverFetch';



class Board extends Component{
    constructor(props){
        super(props);

        this.state = {
            userProfileHead: {},
            streamData: [],
            boardName: ''
        };
    }


    componentDidMount(){

        console.log(this.props.urlParams);
        const username = this.props.urlParams.match.params.user;
        const boardID = this.props.urlParams.match.params.boardid;
        
        console.log(boardID, username)

        const serverResponse = getData(`/board/${boardID}`);

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
                console.log(this.state);
            });

        })
        .catch((err) => {
            console.log(err);
        });


    }


      
    render(){
        
        return(
            <section>
                <PageHead pageHead={this.state.boardName} />
                <Stream sourceFetch='explore' urlParams={this.state.userProfileHead.username} data={this.state.streamData}/>
            </section>
        )
    }
}


export default Board