import React from 'react';

 
function handleFiles(evt) {
    let preview = document.querySelector('.preview');
    let files = evt.target.files;
    
    preview.classList.add("previewPicture");

    if(files && files[0]){
        let reader = new FileReader();

        reader.onload = (evt) => {
            preview.setAttribute('src', evt.target.result);
        };

        reader.readAsDataURL(files[0]);
    }

}

function removeAvatar(){
    const file = document.querySelector('.photo-upload');
    const defaultAvatar = 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg';
    let preview = document.querySelector('.preview');

    file.value = '';
    preview.setAttribute('src', defaultAvatar);
}

const UploadPhoto = (props) => {

    let containerClass;
    let inputName;
    let imgSrc;
    let showRemoveButton;
       

    if(props.isAvatar){
        let previewImgSrc = props.avatar;
        
        const defaultAvatar = 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg';

        if(previewImgSrc !== defaultAvatar){
            showRemoveButton = true;
        }

        containerClass = 'avatar-container';
        inputName = 'user-avatar';
        imgSrc = props.avatar;
        

    }
    if(props.isNewPost){
        containerClass = 'upload-post-container';
        inputName = 'user-photo';
        imgSrc = '';
    }


    return(
        <div>
            <div className={containerClass} >
                <img src={imgSrc} className='preview' />
            </div>
            <input type="file" className='photo-upload' name={inputName} onChange={handleFiles}/>
            {showRemoveButton && 
            <button type='button' onClick={removeAvatar}>Remove Profile Picture</button>} 
        </div>
    )
}


export default UploadPhoto;