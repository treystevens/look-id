import React, { Component } from 'react';
import BoardItem from './BoardItem';
import CreateBoard from './CreateBoard';
import BoardModal from './BoardModal';
import PageHead from './PageHead';
import { getData, sendUserData, goDelete } from '../util/serverFetch';
import { connect } from 'react-redux';
import ConfirmAction from './ConfirmAction';
import Modal from './Modal';


class Boards extends Component{
    constructor(props){
        super(props);

        this.state = {
            boards: [],
            showModal: false,
            actionSuccess: false,
            statusMessage: '',
            showConfirmation: false,
            showAccountVerify: false,
            showCreateBoard: false,
            showOptions: false
        };

        this.handleClickCreateBoard = this.handleClickCreateBoard.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleNewBoardSubmit = this.handleNewBoardSubmit.bind(this);
        this.handleClickBoard = this.handleClickBoard.bind(this);
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
        this.showErrorStatus = this.showErrorStatus.bind(this);
        this.showOptions = this.showOptions.bind(this);
        

        // Add key listener on window to close modal with 'esc' key
        window.addEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false,
                    showAccountVerify: false,
                    showCreateBoard: false
                });
            }
        });
    }

    // Get all of user's boards
    componentDidMount(){
        
        const serverResponse = getData('/board');

        serverResponse.then(response => response.json())
        .then((data) => {

            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                boards: data.boards
            });
        })
        .catch((err) => {
            this.showErrorStatus(err);
            console.log(err);
        });
    }

    // Remove event listener
    componentWillUnmount(){
        // Remove window listener
        window.removeEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
        });
    }
    
    // Close modal on click
    closeModal(evt){

        if(evt.target.className === 'modal' || evt.target.className === 'modal__close-btn'){
            this.setState({
                showModal: false,
                showAccountVerify: false,
                showCreateBoard: false
            });
        }   
    }

    // Open modal to create a new board
    handleClickCreateBoard(){
        
        // Show Login / Sign Up modal if not Authorized - Create Board if authorized
        if(!this.props.isAuth){
            
            this.setState({
                showAccountVerify: true,
                showModal: true,
                showCreateBoard: false
            });
        }
        else{
            this.setState({
                showModal: true,
                showCreateBoard: true
            });
        }
        
    }

    // Creating a new board
    handleNewBoardSubmit(boardName){

        this.setState({
            showCreateBoard: false
        });
        
        const data = {
            boardName: boardName
        };

        const serverResponse = sendUserData('/board/createboard', data);

        serverResponse.then( response => response.json())
        .then((data) => {
            
            if(data.error) return Promise.reject(new Error(data.error));

            // Add newly created board to state
            this.setState({
                boards: this.state.boards.concat(data.boards),
                showConfirmation: true,
                statusMessage: 'Created new board!'

            });
        })
        .catch((err) => {

            this.showErrorStatus(err);
            console.log(err);
        });
    }

    // Show ConfirmAction if error occurred 
    showErrorStatus(err){
        this.setState({
            showConfirmation: true,
            statusMessage: err.errors
        });
    }

    // Show Edit options
    showOptions(){

        const { showOptions } = this.state;

        if(showOptions){
            this.setState({
                showOptions: false
            });
        }
        else{
            this.setState({
                showOptions: true
            });
        }
    }

    // For adding an image to the board from a post
    handleClickBoard(evt){
        
        if(evt.target.classList.contains('boardImg')){
            const boardID = evt.target.getAttribute('data-board-id');
            const postImageElement = document.querySelector('.post__image');
            const postImageSrc = postImageElement.getAttribute('src');

            const data = {
                username: this.props.urlParams.username,
                postID: this.props.urlParams.postID,
                boardID: boardID,
                postImage: postImageSrc
            };

            const serverResponse  = sendUserData('/board/addpost', data);
            
            serverResponse.then(response => response.json())
            .then((data) => {

                if(data.errors) return Promise.reject(new Error(data));

                // Make confirmation that it was added
                if(data.success){
                    this.setState({
                        showConfirmation: true,
                        actionSuccess: true,
                        statusMessage: 'Saved to board!'
                    });
                }
            })
            .catch((err) => {
                this.showErrorStatus(err);
            });
        }
    }

    // Delete board - Click event
    handleDeleteBoard(board){

        const {board: {_id: boardID}} = board;

        const serverResponse = goDelete(`/board/${boardID}/delete`);

        serverResponse
        .then(response => response.json())
        .then((data) => {
            
            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                boards: data.boards
            });
        })
        .catch((err) => {
            this.showErrorStatus(err);
        });
    }



    render(){
        const { showAccountVerify, showConfirmation, showCreateBoard, showOptions } = this.state;

        const userBoards = this.state.boards.map((board) => {
            return (
            <article key={board.board_id}>
                <span onClick={this.showOptions}>...</span>
                <div>
                    {showOptions &&
                    <ul>
                        <li>Edit Board</li>
                        <li onClick={this.handleDeleteBoard.bind(this, {board})}>Delete Board</li>
                        
                    </ul>
                    }
                </div>
                <BoardItem key={board.board_id} board={board} addToBoard={this.props.addToBoard}  urlParams={this.props.urlParams} handleClickBoard={this.handleClickBoard}/>
            </article>
            ) })

        return(
            <section>
                <PageHead pageHead={this.props.pageName} />

                {showConfirmation &&
                <ConfirmAction statusMessage={this.state.statusMessage}/>}

                <div className="boardContainer">
                    <CreateBoard handleClickCreateBoard={this.handleClickCreateBoard} />
                    {userBoards}


                {showAccountVerify &&
                    <Modal source='accountVerify' closeModal={this.closeModal}/>}

                {showCreateBoard &&
                    <BoardModal source="createBoard" closeModal={this.closeModal} handleNewBoardSubmit={this.handleNewBoardSubmit} />}
                
                </div>
            </section>
        )
    }
}

function mapStateToProps(state){
    return{
        isAuth: state.isAuth
    }
}

export default connect(mapStateToProps)(Boards);