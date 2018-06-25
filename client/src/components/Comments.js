import React, { Component } from 'react';
import CommentBox from './CommentBox';

import CommentRow from './CommentRow';
import Notifications from './Notifications';



// const user1 = {
//     user_id: "001",
//     username: "Chocolate",
//     display_picture: "",
//     posts:[
//         {
            
//             post_id: "1234",
//             post_caption: "New to the game, ya heard me man, I be doing my thing!!",
//             image: "/lookid/boards/images/1.jpg",
//             image_id: "01",
//             likes: 32,
//             comments:  [
//                          {
                    //         username: "Jacob",
                    //         user_id: "09",
                    //         date_posted: "",
                    //         comment: "Wow, this is amazing can't believe you really did",
                    //         display_picture:""
                    //     },
                    //     {
                    //         username: "Corn",
                    //         user_id: "12",
                    //         date_posted: "",
                    //         comment: "This looks awesome",
                    //         display_picture:""
                    //     },
                    //     {
                    //         username: "Paul",
                    //         user_id: "0030",
                    //         date_posted: "",
                    //         comment: "I'm buying this right away!",
                    //         display_picture:""
                    //     },

                    // ],
//             timestamp: "",
//             descriptions: [
//                 {
//                 category: "Accesory",
//                 name: "Scarf",
//                 price: "32.50",
//                 stores: ["H&M", "Nordstrom"],
//                 online_link: "nordstrom.com",
//                 description: "gray scarf"
//             }
//         ]
        
//         }
//     ],
//     other_posts: ["/lookid/kfit1.jpg", "/lookid/kfit2.jpg", "/lookid/kfit3.jpg", "/lookid/kfit4.jpg"]

// };



class Comments extends Component{
    constructor(props){
        super(props);
        this.state = {
            comments: this.props.comments,
            shownComments: []
            
        }

        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
    }

    handleAddComment(newComment){

        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let currentDate = new Date();

        let dayDate = currentDate.getDate();
        let monthIndex = currentDate.getMonth()
        let year = currentDate.getFullYear();
        let month = months[monthIndex]

        let date = `${month} ${dayDate}, ${year}`;

        // maybe make a fetch request to server for auth to see which user I am

        // fetch('/comment', {
        //     body: data,
        //     method: 'POST',

        // })
        let addedNewComment = {
            username: 'Hamlinz', // get from auth token I guess...from cookie?
            userid: '0201',
            date_posted: date,
            comment: newComment,
            display_picture: '/lookid/fit6.jpg'
        }



        let currentState = this.state.comments;
        let updatedStateComment = [addedNewComment].concat(currentState)

        {/* <Notifications notifications={addedNewComment}> */}

        // let updatedStateComment = this.state.comments.concat(addedNewComment)
        // this.state.comments.unshift(addedNewComment)
        // let updatedStateComment = this.state.comments
        
        this.setState({
            comments: updatedStateComment
        }, () => {
            console.log(this.state.comments)
        });
    }


    handleDeleteComment(comment){

        let currentState = this.state.comments

        let updatedStateComment = currentState.filter((item) => {
            console.log(item)
            if(item.comment != comment){
                console.log(`does not equal`)
                return item;
            }
        })


        console.log('Delete')
        // Filter through array to remove the comment aargument

        this.setState({
            comments: updatedStateComment
        });
    }

    // Component will mount might need to get some authentication from the server if I'm trying to post a comment


    componentWillMount(){
        // let sendToCommentBox = {
        //     comment_amount: user1.comments.amount,
        //     comment_messages: user1.comments.messages,
        // }
        let comments = this.state.comments

        let userComments = comments.map((comment) => {
            return <CommentRow comment={comment}/>
        })

        

        console.log(userComments, `user comments`)

        console.log(this.state.comments)
        console.log(this.props.comments)
        this.setState({
            shownComments: userComments
        })
    }


    render(){
        return(
            <div>
                <CommentBox handleAddComment={this.handleAddComment}/>
                {/* {this.state.shownComments} */}
                <div>
                { this.state.comments.map((comment) => {
                    return <CommentRow comment={comment}  deleteComment={this.handleDeleteComment}/>
                }) }
                </div>
                {/* <div>
                    <div>
                        {this.state.comments}
                    </div>
                    <a href="/viewallcomments">View all comments</a>
                </div> */}
                
                {/* <CommentRow /> */}
            </div>
            
        )
    }
}

export default Comments