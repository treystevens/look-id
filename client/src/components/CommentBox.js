import React, { Component } from 'react';


class CommentBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            commentValue: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }


    handleSubmit(evt){
        evt.preventDefault();
        // Would make a fetch requests here to POST the new comment data into the database.

        this.props.handleAddComment(this.state.commentValue);
    }

    handleComment(evt){
        this.setState({
            commentValue: evt.target.value
        })
    }

    render(){
        return(
                <div style={{width: '100%'}}>
                    <form onSubmit={this.handleSubmit} style={{display: 'flex', 'flexDirection': 'column'}}>
                        <textarea className="me" cols="50" rows="3" onChange={this.handleComment}></textarea>
                        <button>Submit Comment</button>
                    </form>
                </div>
                )
    }

}


// handleSubmit(evt){
//     evt.preventDefault;
//     // Would make a fetch requests here to POST the new comment data into the database.
// }




// const CommentBox = (props) => {
//     return(
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input type="textfield" className="me" size="10 40" onChange={}/>
//                 <button>Submit Comment</button>
//             </form>
//         </div>
//     )
// }

export default CommentBox;