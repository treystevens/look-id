import React, { Component } from 'react';
import { connect } from 'react-redux';


class BoardModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            boardName: ''
        };


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
        

        // Add key listener on window to close modal with 'esc' key
        window.addEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
        });
    }



    // Handles the input change on creating a new baord
    handleBoardNameChange(evt){
        this.setState({
            boardName: evt.target.value
        });
    }

    // Submission of that new board
    handleSubmit(evt){
        evt.preventDefault();

        this.props.handleNewBoardSubmit(this.state.boardName);

        this.setState({
            boardName: ''
        });
    }


    render(){
        return(
            <div>
                <div className='modal' onClick={this.props.closeModal}>
                    <div className='modal-content'>
                        <form className='create-board' onSubmit={this.handleSubmit}>
                        <button type='button' className='modal__close-btn' onClick={this.props.closeModal}>Close ×</button>
                            <label>Board Name:
                                <input type='text' name='new-board' onChange={this.handleBoardNameChange} value={this.state.value} />
                            </label>
                            <input type='button' value='Cancel' />
                            <button>Create Board</button>
                        </form>
                    </div>
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

export default connect(mapStateToProps)(BoardModal);
    