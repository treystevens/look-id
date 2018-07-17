import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData } from '../util/serverFetch';


class Board extends Component{
    constructor(props){
        super(props);

        this.state = {
            streamData: [],
            boardName: ''
        };
    }

    // Get Board data
    componentDidMount(){

        const boardID = this.props.urlParams.match.params.boardid;
        const serverResponse = getData(`/board/${boardID}`);

        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {

            this.setState({
                streamData: data.stream,
                boardName: data.boardName
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
                <Stream sourceFetch='stream' stream={this.state.streamData} />
            </section>
        )
    }
}


export default Board