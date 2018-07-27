import React, { Component } from 'react';
import PostEngage from './PostEngage';
import Modal from './Modal';
import { getData, sendUserData } from '../util/serverFetch';
import { connect } from 'react-redux';


class PostImage extends Component{
    constructor(props){
        super(props);
    
    this.state = {
        showModal: false,
        iLiked: false,
        likeCount: '',
        showVerify: false,
        showAddToBoard: false
    };

    this.openBoards = this.openBoards.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLikeCount = this.handleLikeCount.bind(this);

    // Close Modal with Escape Key
    window.addEventListener('keydown', (evt) => {

        const { showAddToBoard, showVerify } = this.state;

        if((showAddToBoard || showVerify) && evt.keyCode === 27){
            this.setState({
                showAddToBoard: false,
                showVerify: false
            });
        }
    });
}

    // Data to see if liked post and the amount of likes on a post
    componentDidMount(){


        const urlUser = this.props.urlParams.username;
        const urlPostID = this.props.urlParams.postID;

        // Fetch to server to see if user liked post and like count
        const serverResponse = getData(`/user/${urlUser}/${urlPostID}/likes`);
        
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
            showAddToBoard: true
        });
    }

    // Close Boards Modal
    closeModal(evt){
        if(evt.target.className === 'modal' || evt.target.className === 'modal__close-btn'){
            this.setState({
                showAddToBoard: false,
                showVerify: false
            });
        }   
    }

    // Mutate like count on click
    handleLikeCount(){

        // If user is not authorize prompt login Modal
        if(!this.props.isAuth){
            this.setState({
                showVerify: true
            });
            return -1;
        }

        const urlUser = this.props.urlParams.username;
        const count = this.state.likeCount;
        const urlPostID = this.props.urlParams.postID;
        const data = {
            iLiked: this.state.iLiked
        };
        const serverResponse = sendUserData(`/user/${urlUser}/${urlPostID}/likes`, data);

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

    render(){

        const { showVerify, showAddToBoard } = this.state;
        const urlUser = this.props.urlParams.username;
         
        return(
            <article style={ {'width': '40%'}}>
                <img  className='post__image' src={this.props.image} alt={`${urlUser}'s outfit'`}style={ {'width': '100%'}}/>

                <PostEngage openBoards={this.openBoards} commentCount={this.props.commentCount} likeCount={this.state.likeCount} handleLikeCount={this.handleLikeCount} iLiked={this.state.iLiked}/>

                {showAddToBoard && 
                    <Modal source='addToBoard' closeModal={this.closeModal} image={this.props.image} urlParams={this.props.urlParams}/>}

                {showVerify && 
                    <Modal source='accountVerify' closeModal={this.closeModal} image={this.props.image} urlParams={this.props.urlParams}/>}
            </article>
        )
    }
}

function mapStateToProps(state){
    return{
        isAuth: state.isAuth
    }
}

export default connect(mapStateToProps)(PostImage);