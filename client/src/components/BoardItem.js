import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


const BoardItem = (props) => {
    console.log(props)

    let boardLink = `/boards/${props.board.board_id}`;
    let backgroundImg = props.board.display_image;



    

    return(
        
        
         <div >
             {props.addToBoard ? (
                 <div onClick={props.handleClickBoard}>
                    <div className='board__display' style={ { backgroundImage:`url(${backgroundImg}`} } data-board-id={props.board.board_id}></div>
                    <h1>{props.board.name}</h1>
                </div>
                ) : (
                <Link to={boardLink}>
                    <div className='board__display' style={ { backgroundImage:`url(${backgroundImg}`} }data-board-id={props.board.board_id}></div>
                    <h1>{props.board.name}</h1>
                </Link>
                )}

        </div>
    )
}


function mapStateToProps(state){
        return {
            username: state.username
        }   

}


export default connect(mapStateToProps)(BoardItem);