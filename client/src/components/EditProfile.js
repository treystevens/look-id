import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadAvatar from './UploadAvatar';
import UploadPhoto from './UploadPhoto';
import { sendUserData, getData, sendPhoto } from '../util/serverFetch';

import { updateAvatar } from '../actions/actions';



class EditProfile extends Component{
    constructor(props){
        super(props);

        this.state = {
            avatar: ''
        };

        this.submitEdit = this.submitEdit.bind(this);
    }


    submitEdit(evt){
        evt.preventDefault();

        // Multi/Part form
        const form = document.querySelector('.edit__form');
        const formData = new FormData(form);

        // Get src of avatar upload just incase no file is uploaded or remove profile picture option was clicked
        const imageFromAvatarSrc = document.querySelector('.preview').getAttribute('src');
        
        formData.append('imageFromAvatarSrc', imageFromAvatarSrc);
        

        // Display the key/value pairs (For Debugging)
        // for(var pair of formData.entries()) {
        //     console.log(pair[0]+ ', '+ pair[1]); 
        // }
      
       
        const serverResponse = sendPhoto('/profile/edit', formData);

        serverResponse.then( response => response.json() )
        .then((data) => {
            // Make fade out animation of confirmation that it was saved(reminder)

            
            console.log(data);

        }) 
        .catch((err) => {
            console.log(err);
        });

    }


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


    render(){

        console.log(this.props);
        return(
            <section>
                <PageHead pageHead='Edit Profile' />
                <form onSubmit={this.submitEdit} className='edit__form'>
                    <UploadPhoto avatar={this.state.avatar} isAvatar='avatar-container'/>

                        <label>Bio:
                            <input type="text" onChange={this.bioChange} className='edit__bio' name='bio'/>
                        </label>

                        <label>Website:
                            <input type="text" onChange={this.websiteChange} className='edit__website' name='website'/>
                        </label>

                        {/* <button type="button">Clear</button> */}
                        <button>Save</button>
                </form>
            </section>
        )
    }
}



export default EditProfile