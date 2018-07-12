import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadAvatar from './UploadAvatar';
import { sendUserData, getData, sendPhoto } from '../util/serverFetch';
import { connect } from 'react-redux';
import { updateAvatar } from '../actions/addAuth';



class EditProfile extends Component{
    constructor(props){
        super(props);

        this.submitEdit = this.submitEdit.bind(this);
    }


    submitEdit(evt){
        evt.preventDefault();

        const form = document.querySelector('.edit__form');
        const formData = new FormData(form);

        // Check if the current avatar (this.props.myAvatar - redux) matches the one found in class 'preview'
        // Server will update avatar documents with new avatar if sameAvatar = false
        const previewImage = document.querySelector('.preview').getAttribute('src');
        const currentAvatar = this.props.myAvatar;

        const sameAvatar = previewImage === currentAvatar;

        console.log(sameAvatar)

        formData.append('sameAvatar', sameAvatar);
        formData.append('prevAvatarUrl', this.props.myAvatar);


        // Display the key/value pairs
        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]); 
        }
      
       
        const serverResponse = sendPhoto('/profile/edit', formData);

        serverResponse.then( response => response.json() )
        .then((data) => {
            // Make fade out animation of confirmation that it was saved(reminder)

            this.props.dispatch(updateAvatar(data.avatarUrl));
            console.log(data);

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

        console.log(this.props)
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

function mapStateToProps(state){
    return{
        myAvatar: state.myAvatar,
        username: state.username
    }
}

export default connect(mapStateToProps)(EditProfile)