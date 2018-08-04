import React from 'react';
import Button from './Button';
import './Avatar.css';
 
// Setting the image of the file to the div for a preview
function handleFiles(evt) {
    let preview = document.querySelector('.preview');
    let files = evt.target.files;
    
    preview.classList.add('previewPicture');

    if(files && files[0]){
        let reader = new FileReader();

        reader.onload = (evt) => {
            preview.setAttribute('src', evt.target.result);
        };

        reader.readAsDataURL(files[0]);
    }

}

function removeAvatar(){
    const file = document.querySelector('.upload-photo__file-input');
    const defaultAvatar = 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg';
    let preview = document.querySelector('.preview');

    file.value = '';
    preview.setAttribute('src', defaultAvatar);
}

const UploadPhoto = (props) => {

    let avatarClass;
    let photoClass;
    let inputName;
    let imgSrc;
    let showRemoveButton;
       
    // Display for UploadPhoto if uploading an avatar
    if(props.isAvatar){
        let previewImgSrc = props.avatar;
        
        const defaultAvatar = 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg';

        if(previewImgSrc !== defaultAvatar){
            showRemoveButton = true;
        }

        avatarClass = 'avatar-container  avatar-container--large';
        inputName = 'user-avatar';
        imgSrc = props.avatar;
        

    }
    // Display for UploadPhoto if posting a new photo
    if(props.isNewPost){
        photoClass = 'upload-photo-container';
        inputName = 'user-photo';
        imgSrc = '';
    }


    return(
        <div className={photoClass}>
            <div className={avatarClass} >
                <img src={imgSrc} className='preview' alt=''/>
            </div>
            <input type='file' className='upload-photo__file-input' name={inputName} onChange={handleFiles} accept='.jpg, .jpeg, .png'/>
            {showRemoveButton && 
                <Button dummy={true} onClick={removeAvatar} text='Remove Profile Picture'/>} 
            
        </div>
    )
}


export default UploadPhoto;