import React from 'react';
import Modal from './Modal';
import { connect } from 'react-redux';


const BoardModal = (props) => {

        return(
            <div>
                <form className="create-board">
                    <label>Board Name:
                        <input type="text" name="new-board" />
                    </label>
                    <input type="button" value="Cancel" />
                    <button>Create Board</button>
                </form>
                {!props.isAuth && 
                    <Modal source='accountVerify' />}
            </div>
        )
}

function mapStateToProps(state){
    return{
        isAuth: state.isAuth
    }
}

export default connect(mapStateToProps)(BoardModal);
    