import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData, sendUserData } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import NotFound from './NotFound';


class EditBoard extends Component{
    constructor(props){
        super(props);

        this.state = {
            postsToDelete: [],
            streamData: [],
            boardName: '',
            actionSuccess: false,
            statusMessage: '',
            showConfirmation: false,
            notFound: false,
            isLoading: false,
            isSearching: false,
            hasMore: true,
            scrollCount: 0,
            error: false,
        };

        this.handlePostDelete = this.handlePostDelete.bind(this);
        this.handleFilterPost = this.handleFilterPost.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange =  this.handleNameChange.bind(this);
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


    // onChange for changing board name
    handleNameChange(evt){
        this.setState({
            boardName: evt.target.value
        });
    }

    // Filter out post
    handleFilterPost(postID){
        this.setState({
            // eslint-disable-next-line
            postsToDelete: this.state.postsToDelete.filter((post) => {
                if(post.postID !== postID) return post;
            })
        });
    }

    // Delete post
    handlePostDelete(post, target){

        // User toggling class - Add to state if it's an item user would like to delete
        // Filter if otherwise
        if(target.classList.contains('post__image--edit')){
            this.setState({
                postsToDelete: this.state.postsToDelete.concat(post)
            });
        }
        else{
            this.handleFilterPost(post.postID);
        }
    }

    // Update Board submit - Delete posts or change board name
    handleSubmit(evt){
        evt.preventDefault();

        const data = {
            posts: this.state.postsToDelete,
            boardName: this.state.boardName
        };

        const boardID = this.props.urlParams.match.params.boardid;
        const serverResponse = sendUserData(`/board/${boardID}/edit`, data);

        serverResponse.then( response => response.json())
        .then((data) => {

            this.setState({
                showConfirmation: true,
                actionSuccess: true,
                statusMessage: `Updated!`,
                postsToDelete: [],
                streamData: data.stream,
                boardName: data.boardName
            }, () => {
                const boardName = document.querySelector('.edit__name');
                boardName.value = this.state.boardName;
            });
        })
        .catch((err) => {

            this.setState({
                showConfirmation: true,
                statusMessage: 'Something went wrong with the server. Could not delete posts at the moment. Try again later.'
            });
            console.log(err);
        });
    }

    render(){
        
        const { notFound } = this.state; 
        let deleteMessage;

        if(notFound) return <NotFound />
        

        if(this.state.postsToDelete.length === 1){
            deleteMessage = `Delete (${this.state.postsToDelete.length}) item`;
        }
        else{
            deleteMessage = `Delete (${this.state.postsToDelete.length}) items`;
        }


        return(
            <section>
                <PageHead pageHead={`Edit ${this.state.boardName}`} />

                    {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.confirmAction} statusMessage={this.state.statusMessage}/>
                    }

                    <h1>Click on the images that you would like to delete</h1>
                    
                    <form onSubmit={this.handleSubmit}>
                        <label>Change board name:
                            <input type='text' name='board-name' className='edit__name' onChange={this.handleNameChange} value={this.state.boardName}/>
                        </label>
                        <span>{deleteMessage}</span>
                        <button>Update Board</button>
                    </form>
                <Stream sourceFetch='stream' stream={this.state.streamData} edit={true} handlePostDelete={this.handlePostDelete}/>
                
            </section>
        )
    }

}


export default EditBoard;