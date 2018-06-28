import React, { Component } from 'react';
import PageHead from './PageHead';
import Avatar from './Avatar';

class EditProfile extends Component{
    constructor(props){
        super(props);
    }


    render(){

        
        return(
            <section>
                <PageHead pageHead='Edit Profile' />
                <Avatar />
                <form>
                    <label>Bio:
                        <input type="text" />
                    </label>
                    <label>Website:
                        <input type="text" />
                    </label>
                    <button type="button">Clear</button>
                    <button>Save</button>
                </form>
            </section>
        )
    }
}

export default EditProfile