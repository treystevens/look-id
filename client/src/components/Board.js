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
            boardName: '',
            isLoading: false,
            isSearching: false,
            hasMore: true,
            scrollCount: 0,
        };

        this.loadData = this.loadData.bind(this);

        window.onscroll = () => {
    
            
            const { error, isLoading, hasMore } = this.state;

            // Return if there's an error, already loading or there's no more data from the database
            if (error || isLoading || !hasMore) return;
    
            // Checks that the page has scrolled to the bottom
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {


                const { scrollCount } = this.state;
                const newCount = scrollCount + 1;
            
                this.setState({
                    scrollCount: newCount

                }, () => {

                    this.loadData();
                }); 
            }
        };
    }

    // Get Board data
    componentDidMount(){
        this.loadData();  
    }

    loadData(){
        const { scrollCount, streamData } = this.state;
        const boardID = this.props.urlParams.match.params.boardid;
        const serverResponse = getData(`/board/${boardID}/page/${scrollCount}`);

        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {

            this.setState({
                streamData: streamData.concat(data.stream),
                boardName: data.boardName,
                hasMore: data.hasMore
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
                        {/* <button type='button' onClick={}>Delete Board</button> */}
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