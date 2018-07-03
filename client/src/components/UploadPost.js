import React, { Component } from 'react';
import PageHead from './PageHead';
import UploadItem from './UploadItem';
import CreateItem from './CreateItem';
import UploadPhoto from './UploadPhoto';



class UploadPost extends Component{
    constructor(props){
        super(props);

        this.state = {
            uploadItemCount: 0,
            uploadImgSrc: '',
            captionChange: ''
        }

        this.handleCreateItem = this.handleCreateItem.bind(this);
        this.Check = this.Check.bind(this) 
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.captionChange = this.captionChange.bind(this)
        
    }

    

    handleCreateItem(){

        let currentItemCount;
        currentItemCount = this.state.uploadItemCount;

        this.setState({
            uploadItemCount: currentItemCount + 1
        })

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

        let form = document.querySelector('.user-post')

        let formData = new FormData(form);
        // var imagedata = document.querySelector('.fileUpload').files[0];
        // var userCap = document.querySelector('.userCap')
        // console.log(imagedata)
        // form.append("data", imagedata);
        // form.append('usercap', this.state.captionChange)

        // let data = {
        //     form: form,
        //     userCap: this.state.captionChange
        // }

        
        for (let pair of formData){
            console.log(pair[0]+ ', ' + pair[1]); 
        }


       
        fetch('/profile/uploadpost', {
            body: formData,
            method: 'POST',
            
        })
        .then((response) => {
            console.log(response)
            return response.json()
        })
        .then((actual) => {
            console.log(actual)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render(){

        let itemsToUpload = []

        for(let i = 0; i < this.state.uploadItemCount; i++){
            itemsToUpload.push(<UploadItem key={i} itemNumber={this.state.uploadItemCount}/>)
        }


        return(
            <section>
                <PageHead pageHead='Post an Outfit'/>
                {/* <form action='api/profile/uploadpost' method='post'> */}
                <form onSubmit={this.handleSubmit} className="user-post">
                    <UploadPhoto isNewPost={'new-post'} />
                    <textarea defaultValue='Write a caption...' name="usercaption" className="userCap">
                    </textarea>
                    {/* <input type="text" name="usercaption" className="userCap" onChange={this.captionChange}/> */}
                    <section style={{display: 'flex', flexFlow: 'row wrap'}}>
                        {itemsToUpload}
                    </section>
                    <CreateItem handleCreateItem={this.handleCreateItem}/>
                    
                    <button>Post</button>
                </form>
                
            </section>
        )
    }
}


export default UploadPost;

