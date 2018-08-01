import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Modal.css';
import InputField from './InputField';
import Button from './Button';
import './Modal.css';
import './Button.css';


class BoardModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            boardName: ''
        };


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
    
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
                    <div className='modal-content  modal-content--small'>
                    <Button dummy='true' text='Close x' addClass='btn__close--modal' onClick={this.props.closeModal}/>
                        <div className='modal-overflow-content  container'>
                            <form className='modal__create-board  form' onSubmit={this.handleSubmit} autoComplete='off'>
                    
            

                                <InputField label='Board Name:' type='text' name='new-board' onChange={this.handleBoardNameChange} value={this.state.value} size='med'/>

                                <div className='btn-container'>
                                    <Button dummy='true' text='Cancel' onClick={this.props.closeModal} addClass='btn__cancel--modal btn--med' />
                                    <Button text='Create Board' addClass='btn--update btn--med' />
                                </div>

                                
                            </form>
                        </div>
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
    