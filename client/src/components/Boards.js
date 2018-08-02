import React, { Component } from 'react';
import BoardItem from './BoardItem';
import BoardModal from './BoardModal';
import PageHead from './PageHead';
import { getData, sendUserData, goDelete } from '../util/serverFetch';
import { connect } from 'react-redux';
import ConfirmAction from './ConfirmAction';
import Modal from './Modal';
import CreateElem from './CreateElem';
import './Boards.css';

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
            showOptions: false,
            boardID: ''
        };

        this.handleClickCreateBoard = this.handleClickCreateBoard.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleNewBoardSubmit = this.handleNewBoardSubmit.bind(this);
        this.handleClickBoard = this.handleClickBoard.bind(this);
        this.showErrorStatus = this.showErrorStatus.bind(this);
        this.escModal = this.escModal.bind(this);
    }

    // Get all of user's boards
    componentDidMount(){
        
        const serverResponse = getData('/board');

        // Add key listener on window to close modal with 'esc' key
        window.addEventListener('keydown', this.escModal);

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
        window.removeEventListener('keydown', this.escModal);
    }

    // Close modal with esc key
    escModal(evt){
        if(this.state.showModal && evt.keyCode === 27){
            this.setState({
                showModal: false,
                showAccountVerify: false,
                showCreateBoard: false
            });
        }
    }
    
    // Close modal on click
    closeModal(evt){
        
        if(evt.target.className === 'modal' || evt.target.classList.contains('btn__close--modal') || evt.target.classList.contains('btn__cancel--modal')){
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
                statusMessage: 'Created new board!',
                actionSuccess: true

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
            statusMessage: err.message
        });
    }


    // For adding an image to the board from a post
    handleClickBoard(evt){
        
        if(evt.target.classList.contains('board__display')){
            const boardID = evt.target.getAttribute('data-board-id');
            const postImageElement = document.querySelector('.post__image');
            const postImageSrc = postImageElement.getAttribute('src');
            const boardName = evt.target.parentElement.childNodes[1].textContent;

            const data = {
                username: this.props.urlParams.username,
                postID: this.props.urlParams.postID,
                boardID: boardID,
                postImage: postImageSrc,
                boardName: boardName
            };

            
            

            const serverResponse  = sendUserData('/board/addpost', data);
            
            serverResponse.then(response => response.json())
            .then((data) => {
                
                if(data.error) return Promise.reject(new Error(data.error));
                

                // Make confirmation that it was added
                if(data.success){
                    this.setState({
                        showConfirmation: true,
                        actionSuccess: true,
                        statusMessage: `Saved to "${boardName}"!`
                    });
                }
            })
            .catch((err) => {
                this.showErrorStatus(err);
            });
        }
    }



    render(){
        const { showAccountVerify, showConfirmation, showCreateBoard, actionSuccess } = this.state;


        const userBoards = this.state.boards.map((board) => {
            return (
                <article key={board.board_id} className='board'>
                    <BoardItem key={board.board_id} board={board} addToBoard={this.props.addToBoard}  urlParams={this.props.urlParams} handleClickBoard={this.handleClickBoard}/>
                </article>
            ) })

        return(
            <section className='container'>
                <PageHead pageHead={this.props.pageName} />

                {showConfirmation &&
                <ConfirmAction statusMessage={this.state.statusMessage} actionSuccess={actionSuccess} absolute={true}/>}

                <div className="boards">
                    <CreateElem handleCreate={this.handleClickCreateBoard} text='Create New Board'/>
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