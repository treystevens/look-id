import React, { Component } from 'react';
import BoardItem from './BoardItem';
import CreateBoard from './CreateBoard';
import Modal from './Modal';
import PageHead from './PageHead';
import AddToBoard from './AddToBoard';
// import BoardModal from './BoardModal';


const fakeData = [ 
    {
        board_id: "01",
        board_name: "Shoes I Want",
        board_display_image: "/lookid/boards/display/12.jpg",
        user: "jknow"
    
    },
    {
        board_id: "02",
        board_name: "Fashion Inspiration",
        board_display_image: "/lookid/boards/display/13.jpg",
        user: "jknow"
    
    },
    {
        board_id: "03",
        board_name: "Cool Kids",
        board_display_image: "/lookid/boards/display/14.jpg",
        user: "jknow"
    
    },

]

class Boards extends Component{
    constructor(props){
        super(props);

        this.state = {
            boards: [],
            showModal: false,
        }

        this.handleNewBoard = this.handleNewBoard.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount(){
        let newData;


        if(this.props.addToBoard){
            newData = fakeData.map((board) => {
                return <AddToBoard key={board.board_id} boardInfo={board} postImage={this.props.postImage}/>
            })
        }
        else{
            newData = fakeData.map((board) => {
                return <BoardItem key={board.board_id} boardInfo={board} />
            })
        }


        this.setState({
            boards: newData
        })
 
    
        // console.log(this.props.addtoBoard)

    }

    closeModal(evt){

        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false
            })
        }   
    }

    handleNewBoard(){
        console.log('is clicking')

        this.setState({
            showModal: true
        })
    }


    render(){
        return(
            <div>
                <PageHead pageHead={this.props.pageName} />
                <div className="boardContainer">
                    <CreateBoard handleNewBoard={this.handleNewBoard} />
                    {this.state.boards}

                    {this.state.showModal && 
                    <Modal source="createBoard" closeModal={this.closeModal}/>}
                </div>
            </div>
        )
    }
}

export default Boards;