import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


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

        const urlUser = this.props.urlParams.match.params.user;
        const urlBoardID = this.props.urlParams.match.params.boardid;
       
        const authorized = this.props.username === urlUser && this.props.isAuth;
        
        return(
            <section>
            {authorized &&
                    <div>
                        <Link to={`/user/${urlUser}/boards/${urlBoardID}/edit`}>Edit Board</Link>
                    </div>
                }
                <PageHead pageHead={this.state.boardName} />
                <Stream sourceFetch='stream' stream={this.state.streamData} />
            </section>
        )
    }
}


function mapStateToProps(state){
    return{
        isAuth: state.isAuth,
        username: state.username
    }
}

export default connect(mapStateToProps)(Board);