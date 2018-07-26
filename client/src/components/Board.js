import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NotFound from './NotFound';


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
            error: false,
            showConfirmation: false,
            statusMessage: '',
            actionSuccess: false,
            notFound: false
        };

        this.loadData = this.loadData.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    // Get Board data
    componentDidMount(){
        window.addEventListener('scroll', this.onScroll);
        this.loadData();  
    }

    // Remove event listener
    componentWillUnmount(){
        window.removeEventListener('scroll', this.onScroll);
    }

    loadData(){
        const { scrollCount, streamData } = this.state;
        const boardID = this.props.urlParams.match.params.boardid;
        const serverResponse = getData(`/board/${boardID}/page/${scrollCount}`);

        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {

            // 404 Not Found
            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                streamData: streamData.concat(data.stream),
                boardName: data.boardName,
                hasMore: data.hasMore
            });
        })
        .catch((err) => {
            this.setState({
                notFound: true
            });
            
            console.log(err);
        });
    }

    onScroll(){
    
            
        const { error, isLoading, hasMore } = this.state;

        // Return if there's an error, already loading or there's no more data from the database
        if (error || isLoading || !hasMore) return;

        // Check if user has scrolled to the bottom of the page
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {


            const { scrollCount } = this.state;
            const newCount = scrollCount + 1;
        
            this.setState({
                scrollCount: newCount

            }, () => {

                this.loadData();
            }); 
        }
    }

    render(){

        const urlBoardID = this.props.urlParams.match.params.boardid;
        const { notFound } = this.state;

        if(notFound) return <NotFound />

        return(
            <section>
            
                    <div>
                        <Link to={`/boards/${urlBoardID}/edit`}>Edit Board</Link>
                        {/* <button type='button' onClick={}>Delete Board</button> */}
                    </div>
                
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