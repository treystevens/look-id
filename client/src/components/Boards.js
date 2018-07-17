import React, { Component } from 'react';
import BoardItem from './BoardItem';
import CreateBoard from './CreateBoard';
import BoardModal from './BoardModal';
import PageHead from './PageHead';
import { getData, sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';


class Boards extends Component{
    constructor(props){
        super(props);

        this.state = {
            boards: [],
            showModal: false,
        };

        this.handleClickCreateBoard = this.handleClickCreateBoard.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleNewBoardSubmit = this.handleNewBoardSubmit.bind(this);
        this.handleClickBoard = this.handleClickBoard.bind(this);
        this.disableConfirmAction = this.disableConfirmAction.bind(this);
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

    // Add key listener on window to close modal with 'esc' key
    componentDidUpdate(){


        window.addEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
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
                // Make confirmation that it was added
                if(data.success){
                    this.setState({
                        confirmAction: true
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }


    render(){

        if(this.state.confirmAction){
            setTimeout(this.disableConfirmAction, 1000);
        } 

        let userBoards = this.state.boards.map((board) => {
            return <BoardItem key={board.board_id} board={board} addToBoard={this.props.addToBoard}  urlParams={this.props.urlParams} handleClickBoard={this.handleClickBoard}/> })

        return(
            <section>
                <PageHead pageHead={this.props.pageName} />
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