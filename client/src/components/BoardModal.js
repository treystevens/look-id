import React, { Component } from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';


class BoardModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            boardName: ''
        };


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBoardNameChange = this.handleBoardNameChange.bind(this);
    }


    handleBoardNameChange(evt){
        this.setState({
            boardName: evt.target.value
        });
    }

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
                <div className="modal" onClick={this.props.closeModal}>
                    <div className="modal-content">
                        <form className="create-board" onSubmit={this.handleSubmit}>
                            <label>Board Name:
                                <input type="text" name="new-board" onChange={this.handleBoardNameChange} value={this.state.value}/>
                            </label>
                            <input type="button" value="Cancel" />
                            <button>Create Board</button>
                        </form>
                    </div>
                </div>
                {!this.props.isAuth && 
                    <Modal source='accountVerify' />}
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
    