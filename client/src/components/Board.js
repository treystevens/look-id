import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData } from '../util/serverFetch';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import NotFound from './NotFound';
import { goDelete } from '../util/serverFetch';
import Button from './Button';
import ConfirmAction from './ConfirmAction';
import './Edit.css';

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
            notFound: false,
            showOptions: false,
            boardID: '', 
            redirect: false
        };

        this.loadData = this.loadData.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
        this.showOptions = this.showOptions.bind(this);
        this.escEditOptions = this.escEditOptions.bind(this);
    }

    // Get Board data
    componentDidMount(){
        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('click', this.escEditOptions);
        this.loadData();  
    }

    // Remove event listener
    componentWillUnmount(){
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('click', this.escEditOptions);
    }

    // Close edit options with click 
    escEditOptions(evt){
        if(this.state.showOptions && !evt.target.classList.contains('edit-option')&& !evt.target.classList.contains('btn')){
            this.setState({
                showOptions: false
            });
        }
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
                hasMore: data.hasMore,
                boardID: data.underscoreID
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

    // Show Edit options
    showOptions(){
        

        const { showOptions } = this.state;

        if(showOptions){
            this.setState({
                showOptions: false,
            });
        }
        else{
            this.setState({
                showOptions: true, 
            });
        }
    }

    // Delete board - Click event
    handleDeleteBoard(boardID){


        const serverResponse = goDelete(`/board/${boardID}/delete`);

        serverResponse.then(response => response.json())
        .then((data) => {

            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                redirect: true
            });
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        }) ;
    }

    render(){

        const urlBoardID = this.props.urlParams.match.params.boardid;
        const { notFound, showOptions, boardID, redirect } = this.state;
        

        if(notFound) return <NotFound />

        // Redirect when deleting a board
        if(redirect) return <Redirect to='/boards' />

        return(
            <section className='container'>
            
                
                <PageHead pageHead={this.state.boardName} />

                {this.state.showConfirmation &&
                                <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                            }

                    <div className='edit-container'>
                        <Button text='Edit' dummy={true} onClick={this.showOptions}/>
                            {showOptions &&
                            <div className='edit-dropdown'>
                                <ul className='edit-options'>
                                    <Link to={`/boards/${urlBoardID}/edit`}>
                                        <li className='edit-option'>Edit Board</li>
                                    </Link>
                                    <li onClick={this.handleDeleteBoard.bind(this, boardID)} className='edit-option  edit-option--caution'>Delete Board</li>
                                </ul>
                            </div>
                            }
                        
                    </div>
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