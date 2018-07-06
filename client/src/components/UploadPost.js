import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadPhoto from './UploadPhoto';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Item from './Item';
import { sendUserData, sendPhoto } from '../util/serverFetch';



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
            errorMessage: ''

        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.captionChange = this.captionChange.bind(this);
        
    }

    // Lifting state from Item.js
    handleAddItemToState = (itemState) => {
        this.setState({ items: itemState})
    }

    captionChange(evt){
        this.setState({captionChange: evt.target.value});
    }

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

        const photoResponse = sendPhoto('/profile/uploadphoto', formData);
        photoResponse.then( (response) => {
            
            if(response.status === 422){
                this.setState({
                    errorStatus: true
                });
            }
            return response.json();
        })
        .then((data) => {

            if(this.state.errorStatus){
                this.setState({
                    errorMessage: data.error
                }, () => {
                    return 1;
                });
            }

            // Once a user types into an input length becomes greater than 0 
            else if(this.state.items.length > 0){
                
                const items = {
                    items: this.state.items,
                    postID: data.postID // Takes the postID so we know which post to update
                };
                 
                const serverResponse = sendUserData('/profile/uploaditems', items);

                serverResponse.then( response => response.json())
                .then((res) => {
                    this.setState({
                        postID: data.postID,
                        successfulUpload: true
                    });
                });
            }

            // If user does not add an item
            else{
                this.setState({
                    successfulUpload: true,
                    postID: data.postID
                });
            }
            
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render(){

        if(this.state.successfulUpload){
            let redirectLink = `/user/${this.props.username}/${this.state.postID}`;
            return <Redirect to={redirectLink}/>
        }

        return(
            <section>
                <PageHead pageHead='Post an Outfit'/>
                <form onSubmit={this.handleSubmit} className="user-post">
                    <UploadPhoto isNewPost={'new-post'} />
                    {this.state.errorStatus && 
                    <span>{this.state.errorMessage}</span>}
                    <textarea placeholder='Write a caption...' name="usercaption" className="userCap">
                    </textarea>
                    <section style={{display: 'flex', flexFlow: 'row wrap'}}>
                    </section>
                    <Item addItemToParentState={this.handleAddItemToState}/>
                    <button>Post</button>
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

