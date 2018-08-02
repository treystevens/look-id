import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadPhoto from './UploadPhoto';
import { getData, sendPhoto } from '../util/serverFetch';
import ConfirmAction from './ConfirmAction';
import InputField from './InputField';
import Button from './Button';
import './EditProfile.css';

class EditProfile extends Component{
    constructor(props){
        super(props);

        this.state = {
            avatar: '',
            actionSuccess: false,
            statusMessage: '',
            showConfirmation: false
        };

        this.submitEdit = this.submitEdit.bind(this);
    }

    // Load User's Avatar - Website - Bio
    componentDidMount(){
        const serverResponse = getData('/profile/edit');

        serverResponse.then( response => response.json())
        .then( (data) => {

    
            const bio = document.querySelector('.edit__bio');
            const website = document.querySelector('.edit__website');

            // Form gets submited as form data instead of using state information to submit
            bio.value = data.user.bio || '';
            website.value = data.user.website || '';

            this.setState({
                avatar: data.user.avatar
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    submitEdit(evt){
        evt.preventDefault();

        const { avatar } = this.state;

        // Multi/Part form
        const form = document.querySelector('.form__profile');
        const formData = new FormData(form);

        // Get src of avatar upload just incase no file is uploaded or remove profile picture option was clicked
        const imageFromAvatarSrc = document.querySelector('.preview').getAttribute('src');
        const defaultAvatar = 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg';

        // Only append avatar src if a user doesn't upload a file
        if(imageFromAvatarSrc === '' || imageFromAvatarSrc === defaultAvatar || imageFromAvatarSrc === avatar){
            formData.append('imageFromAvatarSrc', imageFromAvatarSrc);
        }
    
        
        // Display the key/value pairs (For Debugging)
        // for(var pair of formData.entries()) {
        //     console.log(pair[0]+ ', '+ pair[1]); 
        // }
      
        const serverResponse = sendPhoto('/profile/edit', formData);

        serverResponse
        .then( response => response.json() )
        .then((data) => {
            if(data.error) return Promise.reject(new Error(data.error));
            
            this.setState({
                showConfirmation: true,
                actionSuccess: true,
                statusMessage: 'Saved!'
            });
        }) 
        .catch((err) => {

            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
        });
    }


    render(){

        return(
            <section className='container'>
                <PageHead pageHead='Edit Profile' />

                {this.state.showConfirmation &&
                    <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                }

                <form onSubmit={this.submitEdit} className='form__profile' autoComplete='off'>
                    <UploadPhoto avatar={this.state.avatar} isAvatar='avatar-container' addClass='avatar-container--med'/>


                        <InputField label='Bio:' onChange={this.bioChange} name='bio' size='med' addClass='edit__bio'/>


                        <InputField label='Website:' onChange={this.websiteChange} name='website' size='med' addClass='edit__website'/>
                     

                        <Button text='Save' addClass='btn--update  btn--small' />
                </form>
            </section>
        )
    }
}



export default EditProfile
