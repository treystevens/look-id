import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadPhoto from './UploadPhoto';
import ItemList from './ItemList';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';



class UploadPost extends Component{
    constructor(props){
        super(props);

        this.state = {
            addItemCount: 0,
            uploadImgSrc: '',
            captionChange: '',
            addedItems: [],
            successfulUpload: false,
            postID: ''

        };


        this.Check = this.Check.bind(this) 
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.captionChange = this.captionChange.bind(this);
        
    }

    

    Check(evt){
        console.log('We inserted a file')
        console.log(evt.target)
        console.dir(evt.target)
    }

    captionChange(evt){
        this.setState({captionChange: evt.target.value});
    }

    handleSubmit(evt){

        evt.preventDefault();

        let form = document.querySelector('.user-post');

        let formData = new FormData(form);
        
        for (let pair of formData){
            console.log(pair[0]+ ', ' + pair[1]); 
        }



       
        fetch('/profile/uploadpost', {
            body: formData,
            method: 'POST',
            credentials: 'include'
            
        })
        .then( response => response.json())
        .then((data) => {

            console.log(data);

            this.setState({
                successfulUpload: true,
                postID: data.postID
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render(){

        if(this.state.successfulUpload){
            let redirectLink = `/user/${this.props.username}/${this.state.postID}`;

            console.log(redirectLink);

            // this.props.history.push(redirectLink)
            console.log(this.props.history)
            return <Redirect to={redirectLink}/>
        }

        return(
            <section>
                <PageHead pageHead='Post an Outfit'/>
                <form onSubmit={this.handleSubmit} className="user-post">
                    <UploadPhoto isNewPost={'new-post'} />
                    <textarea defaultValue='Write a caption...' name="usercaption" className="userCap">
                    </textarea>
                    {/* <input type="text" name="usercaption" className="userCap" onChange={this.captionChange}/> */}
                    <section style={{display: 'flex', flexFlow: 'row wrap'}}>
                    </section>
                    <ItemList />
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

