import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


const BoardItem = (props) => {
    console.log(props)

    let boardLink = `/user/${props.username}/boards/${props.board.board_id}`;
    let backgroundImg = props.board.display_image;



    

    return(
        
        
         <div className="board">
             {props.addToBoard ? (
                 <div onClick={props.handleClickBoard}>
                    <div className="boardImg" style={ { backgroundImage:`url(${backgroundImg}`, backgroundColor: 'gray'} } data-board-id={props.board.board_id}></div>
                    <h1>{props.board.name}</h1>
                </div>
                ) : (
                <Link to={boardLink}>
                    <div className="boardImg" style={ { backgroundImage:`url(${backgroundImg}`, backgroundColor: 'gray'} }data-board-id={props.board.board_id}></div>
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