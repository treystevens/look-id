import React, { Component } from 'react';
import PostEngage from './PostEngage';
import Modal from './Modal';
import { getData, sendUserData } from '../util/serverFetch';


class PostImage extends Component{
    constructor(props){
        super(props);
    
    this.state = {
        showModal: false,
        iLiked: false,
        likeCount: ''
    };

    this.openBoards = this.openBoards.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLikeCount = this.handleLikeCount.bind(this);
}

    // Data to see if liked post and the amount of likes on a post
    componentDidMount(){


        const urlUsernameParam = this.props.urlParams.username;
        const urlPostID = this.props.urlParams.postID;

        // Fetch to server to see if user liked post and like count
        const serverResponse = getData(`/user/${urlUsernameParam}/${urlPostID}/likes`);
        
        serverResponse.then(response => response.json())
        .then((data) => {
            
            this.setState({
                iLiked: data.iLiked,
                likeCount: data.likeCount
            });

        })
        .catch((err) => {
            console.log(err);
        });
    }

    // Show boards to add the post to
    openBoards(){
        this.setState({
            showModal: true
        });
    
    }

    // Close Boards Modal
    closeModal(evt){
        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false
            });
        }   
    }

    // Mutate like count on click
    handleLikeCount(){

        const urlUsernameParam = this.props.urlParams.username;
        const count = this.state.likeCount;
        const urlPostID = this.props.urlParams.postID;
        const data = {
            iLiked: this.state.iLiked
        };
        const serverResponse = sendUserData(`/user/${urlUsernameParam}/${urlPostID}/likes`, data);

        serverResponse.then( response => response.json())
        .then((data) => {

            if(data.success){
                if(this.state.iLiked){
                    this.setState({
                        likeCount: count - 1,
                        iLiked: false
                    });
                }
                else{
                    // Change the image of the heart to be filled
                    this.setState({
                        likeCount: count + 1,
                        iLiked: true
                    });
                }
            }

            
        })
        .catch((err) => {
            console.log(err);
        });


        
    }

    // Close Modal with Escape Key
    componentDidUpdate(){

        window.addEventListener('keydown', (evt) => {
            if(this.state.showModal && evt.keyCode === 27){
                this.setState({
                    showModal: false
                });
            }
        });
    }

    render(){

        return(
            <article style={ {"width": "40%"}}>
                <img  className='post__image' src={this.props.image} style={ {"width": "100%"}}/>

                <PostEngage openBoards={this.openBoards} commentCount={this.props.commentCount} likeCount={this.state.likeCount} handleLikeCount={this.handleLikeCount} iLiked={this.state.iLiked}/>

                {this.state.showModal && 
                    <Modal source="addToBoard" closeModal={this.closeModal} image={this.props.image} urlParams={this.props.urlParams}/>}
            </article>
            
            
        )
    }
}

export default PostImage