import React, { Component } from 'react';
import Item from './Item';
import { getData, sendUserData } from '../util/serverFetch';
import { Redirect, Link } from 'react-router-dom'; 
import ConfirmAction from './ConfirmAction';
import { connect } from 'react-redux';
import NotFound from './NotFound';
import Button from './Button';
import PageHead from './PageHead';
import './Edit.css';

class EditPost extends Component{
    constructor(props){
        super(props);

        this.state = {
            caption: '',
            items: [],
            image: '',
            actionSuccess: false,
            statusMessage: '',
            showConfirmation: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.captionChange = this.captionChange.bind(this);
        this.handleAddItemToState = this.handleAddItemToState.bind(this);
    }

    // Get Post data to fill in inputs
    componentDidMount(){

        const urlPostID = this.props.urlParams.match.params.postid;
        const urlUser = this.props.username;

        const serverResponse = getData(`/user/${urlUser}/${urlPostID}/edit`);

        serverResponse.then(response => response.json())
        .then((data) => {
            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                image: data.post.image,
                caption: data.post.caption,
            }, () => {
                // Set caption input to value stored in database
                const postCaption = document.querySelector('.user-caption');
                postCaption.value = this.state.caption;
            }); 
        })
        .catch((err) => {
            this.setState({
                notFound: true
            });
            console.log(err);
        });
    }

    // User input change for photo caption
    captionChange(evt){
        this.setState({caption: evt.target.value});
    }

    // Lifting state from Item.js
    handleAddItemToState(itemState){
        this.setState({ items: itemState});
    }

    // Updated post to server
    handleSubmit(evt){
        evt.preventDefault();

        const username = this.props.username;
        const urlPostID = this.props.urlParams.match.params.postid;
        
        const { items, caption } = this.state;
        const data = {
            items: items,
            caption: caption
        };

        const serverResponse = sendUserData(`/user/${username}/${urlPostID}/edit`, data);

        serverResponse
        .then( response => response.json())
        .then(() => {

            this.setState({
                showConfirmation: true,
                actionSuccess: true,
                statusMessage: 'Updated!'
            });
        })
        .catch((err) => {
            
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        });
    }

    render(){

        const urlUser = this.props.urlParams.match.params.user;
        const {isAuth, username} = this.props;
        const urlPostID = this.props.urlParams.match.params.postid;
        const { notFound } = this.state;

        // 404 Not Found
        if(notFound) return <NotFound />
        
        // Make sure only authorized user can visit this page
        if(urlUser !== username && !isAuth){
            return <Redirect to={`/user/${urlUser}/${urlPostID}`} />
        }

        return(
            <section className='container'>
                <PageHead pageHead='Update Post'/>
                <div>
                    <Link to={`/user/${urlUser}/${urlPostID}`} className='edit__back'>
                    <svg className='edit__caret' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" height='30px' width='30px'><path d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"/></svg>
                    Back to Post</Link>
                </div>
                
                <form onSubmit={this.handleSubmit} className='user-post' autoComplete='off'>
                    {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                    }
                    <div className='edit-container'>
                        <Button text='Update Post' addClass='btn--update'/>
                    </div>
                    <div className='upload-post__flex'>
                        <div className='upload-photo-container'>
                            <div className='photo-container' >
                                <img src={this.state.image} alt={`${urlUser}'s outfit post'`}  className='preview'/>
                            </div>           
                        </div>
                        <div className='upload-post__info'>
                            <textarea placeholder='Write a caption...' name='usercaption' className='user-caption' onChange={this.captionChange}>
                            </textarea>
                            <Item editPost={true} urlParams={this.props.urlParams} addItemToParentState={this.handleAddItemToState}/>
                        </div>
                    </div>
                    
                </form>
            </section>


            
        )
    }
}

function mapStateToProps(state){
    return {
        username: state.username,
        isAuth: state.isAuth
    }
}

export default connect(mapStateToProps)(EditPost);

