import React, { Component } from 'react';
import BoardItem from './BoardItem';
import CreateBoard from './CreateBoard';
import BoardModal from './BoardModal';
import PageHead from './PageHead';
import PostAddToBoard from './PostAddToBoard';
import { getData, sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';
// import BoardModal from './BoardModal';


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

    componentDidMount(){
        
        const serverResponse = getData('/board');

        serverResponse.then(response => response.json())
        .then((data) => {
            console.log(data);

            this.setState({
                boards: data.boards
            });
        })
        .catch((err) => {
            console.log(err);
        });

    }

    componentDidUpdate(){


        window.addEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
        });
    }

    closeModal(evt){

        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false
            });
        }   
    }



    handleClickCreateBoard(){

        this.setState({
            showModal: true
        });
    }

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
            console.log(data);


            // Only add the new board..I'm sending bac all the ones again making it a duplicate key
            this.setState({
                boards: this.state.boards.concat(data.boards)
            })
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

    handleClickBoard(evt){
        console.log(evt.target);


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

            

        console.dir(evt.target); // would need prevElementSibling to get the image dataset if you click on the board
        console.log('we clicking the baord dawogg!!!')
    }


    render(){

        if(this.state.confirmAction){
            setTimeout(this.disableConfirmAction, 1000);
        } 


        console.log(this.props);
        console.log(this.state);

        let userBoards = this.state.boards.map((board) => {
            return <BoardItem key={board.board_id} board={board} addToBoard={this.props.addToBoard}  urlParams={this.props.urlParams} handleClickBoard={this.handleClickBoard}/> })

        // if(this.props.addToBoard){
        //     userBoards = this.state.boards.map((board) => {
        //         return <PostAddToBoard key={board.board_id} boardInfo={board} postImage={this.props.postImage}/>
        //     })
        // }
        // else{
        //     userBoards = this.state.boards.map((board) => {
        //         return <BoardItem key={board.board_id} boardInfo={board} />
        //     })
        // }


        return(
            <div>
                <PageHead pageHead={this.props.pageName} />
                <div className="boardContainer">
                    <CreateBoard handleClickCreateBoard={this.handleClickCreateBoard} />
                    {userBoards}

                    {this.state.showModal && 
                    <BoardModal source="createBoard" closeModal={this.closeModal} handleNewBoardSubmit={this.handleNewBoardSubmit}/>}
                    
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        isAuth: state.isAuth
    }
}

export default connect(mapStateToProps)(Boards);