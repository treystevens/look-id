import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadPhoto from './UploadPhoto';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Item from './Item';
import { sendUserData, sendPhoto } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import './UploadPost.css';
import Button from './Button';


class UploadPost extends Component{
    constructor(props){
        super(props);

        this.state = {
            addItemCount: 0,
            uploadImgSrc: '',
            captionChange: '',
            addedItems: [],
            successfulUpload: false,
            postID: '',
            items: {},
            errorMessage: '',
            statusMessage: '',
            showConfirmation: false

        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.captionChange = this.captionChange.bind(this);
        this.handleAddItemToState = this.handleAddItemToState.bind(this);
    }

    // Lifting state from Item.js
    handleAddItemToState(itemState){
        this.setState({ items: itemState});
    }

    // User input change for photo caption
    captionChange(evt){
        this.setState({captionChange: evt.target.value});
    }

    // Submiting new post
    handleSubmit(evt){
        evt.preventDefault();

        // Reset error state
        this.setState({
            errorStatus: false
        });

        const form = document.querySelector('.user-post');
        const formData = new FormData(form);

        // Logging form data making sure it's correct
        // for (let pair of formData){
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }

        let returnedPostID;

        const photoResponse = sendPhoto('/profile/uploadphoto', formData);
        photoResponse.then( response => response.json())
        .then((data) => {

            if(data.error) return Promise.reject(new Error(data.error));

            returnedPostID = data.postID;

            // If items are present in state upload them as well
            if(this.state.items.length > 0){
                
                const items = {
                    items: this.state.items,
                    postID: returnedPostID // Takes the postID so we know which post to update
                };

                // Save items to the database
                const serverResponse = sendUserData('/profile/uploaditems', items);

                // <--- Response from adding items
                return serverResponse; 
            }

            // If user does not add an item
            else{
                this.setState({
                    successfulUpload: true,
                    postID: returnedPostID
                });
            }
            
        })
        .then( response => response.json())
        .then((data) => {
            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                postID: returnedPostID,
                successfulUpload: true
            });
        })
        .catch((err) => {

            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err.message);
        });
    }

    render(){


        // Redirect to the post after a user succesfully uploads a new post
        if(this.state.successfulUpload){
            let redirectLink = `/user/${this.props.username}/${this.state.postID}`;
            return <Redirect to={redirectLink}/>
        }

        return(
            <section className='container'>
                <PageHead pageHead='Post an Outfit'/>
                
                <form onSubmit={this.handleSubmit} className='user-post' autoComplete='off'>
                    {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                    }
                    <div className='edit-container'>
                        <Button text='Upload Post' addClass='btn--update'/>
                    </div>
                    <div className='upload-post__flex'>
                        <UploadPhoto isNewPost={'new-post'} />
                        <div className='upload-post__info'>
                            <textarea placeholder='Write a caption...' name='usercaption' className='user-caption'>
                            </textarea>
                        
                            <Item addItemToParentState={this.handleAddItemToState}/>
                        </div>
                    </div>
                    
                </form>
                
            </section>
        )
    }
}

function mapStateToProps(state){
    return{
        username: state.username
    }
}

export default connect(mapStateToProps)(UploadPost);

