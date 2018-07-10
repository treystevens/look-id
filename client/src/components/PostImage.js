import React, { Component } from 'react';
import PostEngage from './PostEngage';
import Modal from './Modal';
import { getData, sendUserData } from '../util/serverFetch';


class PostImage extends Component{
    constructor(props){
        super(props);
    
    this.state = {
        showModal: false,
        liked: false,
        likeCount: ''
   
    };

    this.openBoards = this.openBoards.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLikeCount = this.handleLikeCount.bind(this);
}

    componentDidMount(){
            
        const urlUsernameParam = this.props.urlParams.username;
        const urlPostID = this.props.urlParams.postID;

        const serverResponse = getData(`/user/${urlUsernameParam}/${urlPostID}`);
        
        serverResponse.then(response => response.json())
        .then((data) => {
            console.log(data);

            let liked = false;

            for(let users of data.post.liked){
                if(users === data.myUsername){  
                    liked = true;
                }
            }

            this.setState({
                liked: liked,
                likeCount: data.post.liked.length
            });

        })
        .catch((err) => {
            console.log(err);
        });
    }

openBoards(){
    this.setState({
        showModal: true
    });
   
}

closeModal(evt){
    if(evt.target.className === 'modal'){
        this.setState({
            showModal: false
        });
    }   
}

handleLikeCount(){

    const count = this.state.likeCount;
    const postID = this.props.urlParams.postID;
    const data = {
        liked: this.state.liked
    };
    const serverResponse = sendUserData(`/user/${postID}/like`, data);

    serverResponse.then( response => response.json())
    .then((data) => {

        if(data.success){
            if(this.state.liked){
                this.setState({
                    likeCount: count - 1,
                    liked: false
                });
            }
            else{
                // Change the image of the heart to be filled
                this.setState({
                    likeCount: count + 1,
                    liked: true
                });
            }
        }

        
    })
    .catch((err) => {
        console.log(err);
    });


    
}

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

        console.log(this.props)
        return(
            <article style={ {"width": "40%"}}>
                <img  className='post__image' src={this.props.image} style={ {"width": "100%"}}/>

                <PostEngage openBoards={this.openBoards} commentCount={this.props.commentCount} likeCount={this.state.likeCount} handleLikeCount={this.handleLikeCount} liked={this.state.liked}/>

                {this.state.showModal && 
                    <Modal source="addToBoard" closeModal={this.closeModal} image={this.props.image} urlParams={this.props.urlParams}/>}
            </article>
            
            
        )
    }
}

export default PostImage