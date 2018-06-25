import React from 'react';


function handleFiles(evt) {
    let preview = document.querySelector('.preview');
    let files = evt.target.files;
    
    preview.classList.add("previewPicture");

    if(files && files[0]){
        let reader = new FileReader();

        reader.onload = (e) => {
            preview.setAttribute('src', e.target.result);
        };

        reader.readAsDataURL(files[0]);
    }

  }

const UploadPhoto = (props) => {

    let containerClass;
    let inputName;

    if(props.isAvatar){
        containerClass = props.isAvatar;
        inputName = 'user-avatar';
    }
    if(props.isNewPost){
        containerClass = props.isNewPost;
        inputName = 'user-photo';
    }

    return(
        <div>
            <div className={containerClass}>
                <img src='' className='preview' />
            </div>

            <input type="file" className='fileUpload' name={inputName} onChange={handleFiles}/>
        </div>
    )
}

export default UploadPhoto;