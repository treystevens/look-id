import React, { Component } from 'react'
import UploadPhoto from './UploadPhoto'


// const Avatar = (props) => {



// }

class Avatar extends Component{
    constructor(props){
        super(props)

        this.state = {
            showEditTools: false,
            hasAvatar: true
        }

        this.handleShowEdit = this.handleShowEdit.bind(this);
        this.handleHideEdit = this.handleHideEdit.bind(this);
    }

    // Check if the user already has a display picture


    handleShowEdit(evt){
        this.setState({
            showEditTools: true
        }, () => {
            // document.addEventListener("click", this.handleHideEdit);
            console.log(this.state.showEditTools, `showedit`)
        })
        document.addEventListener("click", this.handleHideEdit);
        console.log(evt.target)
        
    }

    handleHideEdit(evt){
        this.setState({
            showEditTools: false
        }, () => {
            console.log(this.state.showEditTools, `hide edit`)
        })
        document.removeEventListener("click", this.handleHideEdit);
        console.dir(evt.target)
        if(evt.target.textContent === 'Change Profile Picture'){
            console.log(`changing picture`)
        }
        if(evt.target.textContent === 'Remove Profile Picture'){
            console.log(`Remove Profile Picture`)
        }
    }

    


    render(){
        const hasAvi = this.state.hasAvatar;

        // (<div style={{position: 'absolute', backgroundColor: 'tan', width: '200px', height: '200px'}}>
        //     <span>Change Profile Picture</span>
        //     <span>Remove Profile Picture</span>
        // </div>)

        let aviOptions;

        if(hasAvi){
            aviOptions = (<div>
            <span>Change Profile Picture</span>
            <span>Remove Profile Picture</span>
        </div>)
        }
        else{
            aviOptions = (<div><span>Upload Picture</span></div>)
        }



        return(
            <section style={{margin: '80px'}} className="editAva">

                <UploadPhoto isAvatar='avatar-container' />
                {/* <img src="/" style={{width: '100px', height: '100px'}}/> */}
                {/* <span style={{position: 'relative'}} onClick={this.handleShowEdit}>Edit Profile Picture</span> */}
                {aviOptions}
            </section>
        )
    }
}


export default Avatar