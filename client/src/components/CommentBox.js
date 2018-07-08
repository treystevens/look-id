import React, { Component } from 'react';
import { sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';


class CommentBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            commentValue: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }


    handleSubmit(evt){
        evt.preventDefault();
        // When I submit here
        // if I want to comment I send my user, the date and the comment
        // When I click on submit -> I take my username & (time stamp) -> go to end point on server -> (time stamp) -> Get my information -> Save comment to that person's post comment box
        // Might have to make the avatar a global store in redux
        // --> Post comment -> Get the user of the page I'm commenting on post ID -> take my username & comment --> send to server --> time stamp --> push comment into that user's post ID comment section -> bring that comment back to refresh the component

        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let currentDate = new Date();

        let dayDate = currentDate.getDate();
        let monthIndex = currentDate.getMonth();
        let year = currentDate.getFullYear();
        let month = months[monthIndex];

        let date = `${month} ${dayDate}, ${year}`;

        const userPage = {
            username: this.props.urlParams.username,
            postID: this.props.urlParams.postID
        };

        const newComment = {
            username: this.props.username, // get from auth token I guess...from cookie?
            // postID: '0201',
            date_posted: date,
            comment: this.state.commentValue,
            avatar: this.props.avatar
        };

        console.log(this.props)


        const data = {
            newComment: newComment,
            userPage: userPage
        };

        // console.log(data)


        const serverResponse = sendUserData('/comment', data);

        serverResponse.then(response => response.json())
        .then((data) => {
            console.log(data, `response from comment`)
            
            // pass back the data needed to display the comment
            this.props.handleAddComment(data.comment);
        })
        .catch((err) => {
            console.log(err);
        });
        // Would make a fetch requests here to POST the new comment data into the database.

        
    }

    handleComment(evt){
        this.setState({
            commentValue: evt.target.value
        });
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

// Might add an avatar to redux store for comments
function mapStateToProps(state) {
    return {
      username: state.username,
      isAuth: state.isAuth,
      avatar: state.avatar
    };
}


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

export default connect(mapStateToProps)(CommentBox);