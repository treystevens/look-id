import React, { Component } from 'react';
import BoardItem from './BoardItem';
import CreateBoard from './CreateBoard';
import BoardModal from './BoardModal';
import PageHead from './PageHead';
import { getData, sendUserData, goDelete } from '../util/serverFetch';
import { connect } from 'react-redux';
import ConfirmAction from './ConfirmAction';


class Boards extends Component{
    constructor(props){
        super(props);

        this.state = {
            boards: [],
            showModal: false,
            actionSuccess: false,
            statusMessage: '',
            showConfirmation: false
        };

        this.handleClickCreateBoard = this.handleClickCreateBoard.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleNewBoardSubmit = this.handleNewBoardSubmit.bind(this);
        this.handleClickBoard = this.handleClickBoard.bind(this);
        this.disableConfirmAction = this.disableConfirmAction.bind(this);
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);
        

        // Add key listener on window to close modal with 'esc' key
        window.addEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
        });
    }

    // Get all of user's boards
    componentDidMount(){
        
        const serverResponse = getData('/board');

        serverResponse.then(response => response.json())
        .then((data) => {
            this.setState({
                boards: data.boards
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    
    // Close modal on click
    closeModal(evt){

        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false
            });
        }   
    }

    // Open modal to create a new board
    handleClickCreateBoard(){
        this.setState({
            showModal: true
        });
    }

    // Creating a new board
    handleNewBoardSubmit(boardName){

        this.setState({
            showModal: false
        });
        
        const data = {
            boardName: boardName
        };

        const serverResponse = sendUserData('/board/createboard', data);

        serverResponse.then( response => response.json())
        .then((data) => {
            console.log(data, `data for boards`)
            
            // Add the newly created board to state after server response
            this.setState({
                boards: this.state.boards.concat(data.boards)
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    disableConfirmAction(){
        this.setState({
            confirmAction: false
        });
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
                console.log(data)

                if(data.errors) return Promise.reject(data);
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
                
                this.setState({
                    showConfirmation: true,
                    statusMessage: err.errors
                });
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
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        });
    }


    render(){

        let userBoards = this.state.boards.map((board) => {
            return (
            <article key={board.board_id}>
                <span>...</span>
                <div>
                    <ul>
                        <li>Edit Board</li>
                        {/* <li onClick={this.handleDeleteBoard}>Delete Board</li> */}
                        <li onClick={this.handleDeleteBoard.bind(this, {board})}>Delete Board</li>
                        
                    </ul>
                </div>
                <BoardItem key={board.board_id} board={board} addToBoard={this.props.addToBoard}  urlParams={this.props.urlParams} handleClickBoard={this.handleClickBoard}/>
            </article>
            ) })

        return(
            <section>
                <PageHead pageHead={this.props.pageName} />

                {this.state.showConfirmation &&
                <ConfirmAction statusMessage={this.state.statusMessage}/>}

                <div className="boardContainer">
                    <CreateBoard handleClickCreateBoard={this.handleClickCreateBoard} />
                    {userBoards}

                    {this.state.showModal && 
                    <BoardModal source="createBoard" closeModal={this.closeModal} handleNewBoardSubmit={this.handleNewBoardSubmit}/>}
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