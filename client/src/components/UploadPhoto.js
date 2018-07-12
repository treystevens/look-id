import React from 'react';
import { connect } from 'react-redux';
 
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
    let imgSrc;
    

    if(props.isAvatar){
        containerClass = props.isAvatar;
        inputName = 'user-avatar';
        imgSrc = props.myAvatar;

    }
    if(props.isNewPost){
        containerClass = props.isNewPost;
        inputName = 'user-photo';
        imgSrc = '';
    }


    return(
        <div>
            <div className={containerClass} style = {{width: '120px',height: '120px', borderRadius: '50%', overflow: 'hidden'}}>
                <img src={imgSrc} className='preview' />
            </div>

            <input type="file" className='fileUpload' name={inputName} onChange={handleFiles}/>
        </div>
    )
}

function mapStateToProps(state){
    return{
        myAvatar: state.myAvatar
    }
}

export default connect(mapStateToProps)(UploadPhoto);