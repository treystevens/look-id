import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadAvatar from './UploadAvatar';
import { sendUserData, getData } from '../util/serverFetch';



class EditProfile extends Component{
    constructor(props){
        super(props);

        this.submitEdit = this.submitEdit.bind(this);
    }


    submitEdit(evt){
        evt.preventDefault();

        const form = document.querySelector('.edit__form');
        const formData = new FormData(form);
      
       
        fetch('/profile/edit', {
            body: formData,
            method: 'POST',
            credentials: 'include'
        })
        .then( response => response.json() )
        .then((settings) => {
            // Make fade out animation of confirmation that it was saved(reminder)

            console.log(settings);

        }) 
        .catch((err) => {
            console.log(err);
        });

    }


    componentDidMount(){
        const serverResponse = getData('/profile/edit');

        serverResponse.then( response => response.json())
        .then( (settings) => {

            console.log(settings, ` believe this will be undefined or null`);

            const bio = document.querySelector('.edit__bio');
            const website = document.querySelector('.edit__website');


            bio.value = settings.user.bio || '';
            website.value = settings.user.website || '';

            // this.setState({
            //     bio: settings.bio,
            //     website: settings.website
            // }, () => {
            //     const bio = document.querySelector('.edit__bio');
            //     const website = document.querySelector('.edit__website');


            //     bio.val = this.state.bio;
            //     website.val = this.state.website;

            // });

        })
        .catch((err) => {
            console.log(err);
        });
    }


    render(){
        return(
            <section>
                <PageHead pageHead='Edit Profile' />
                <form onSubmit={this.submitEdit} className='edit__form'>
                    <UploadAvatar />
                    <label>Bio:
                        <input type="text" onChange={this.bioChange} className='edit__bio' name='bio'/>
                    </label>
                    <label>Website:
                        <input type="text" onChange={this.websiteChange} className='edit__website' name='website'/>
                    </label>
                    <button type="button">Clear</button>
                    <button>Save</button>
                </form>
            </section>
        )
    }
}

export default EditProfile