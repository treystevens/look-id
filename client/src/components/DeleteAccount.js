import React, { Component } from 'react';
import PageHead from './PageHead';


class DeleteAccount extends Component{
    constructor(props){
        super(props)
    }


    render(){
        return(
            <section>
                <PageHead pageHead='Delete Account' />
                <div>
                    <form action="">
                        <label>
                            Username:
                            <input type="text"/>
                        </label>
                        <label>
                            Password:
                            <input type="text"/>
                        </label>
                        <label>
                            Re-enter Password:
                            <input type="text"/>
                        </label>
                    </form>
                </div>
            </section>

        )
    }
}

export default DeleteAccount