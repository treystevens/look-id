import React, { Component } from 'react';
import PageHead from './PageHead';


class ChangePassword extends Component{
    constructor(props){
        super(props)
    }


    render(){
        return(
            <section>
                <PageHead pageHead='Change Password' />
                <div>
                    <form action="">
                        <label>
                            Current Password:
                            <input type="text"/>
                        </label>
                        <label>
                            New Password:
                            <input type="text"/>
                        </label>
                        <label>
                            Re-enter New Password:
                            <input type="text"/>
                        </label>
                    </form>
                </div>
            </section>
        )
    }
}

export default ChangePassword