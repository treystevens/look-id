import React, { Component } from 'react';
import { connect } from 'react-redux';
import InputField from './InputField';
import Button from './Button';
import './Button.css';
import './Modal.css';


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
        
        if(evt.target.value.length >= 25) return 1;
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
                        <div className='modal-overflow-content '>
                            <form className='form__create-board' onSubmit={this.handleSubmit} autoComplete='off'>
                    
                

                                <InputField label='Board Name:' type='text' name='new-board' onChange={this.handleBoardNameChange} value={this.state.boardName} size='large' maxLength='20'/>

                                <div className='btn-container'>
                                    <Button dummy='true' text='Cancel' onClick={this.props.closeModal} />
                                    <Button text='Create Board' addClass='btn--update' />
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
    