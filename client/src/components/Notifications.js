import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'; 


class Notifications extends Component{
    constructor(props){
        super(props)
    }

    // componentDidUpdate(){
    //     console.log(`notifications did update`)
    // }

    // or
    componentDidMount(){
        // get the notification data for this year
        console.log(`notifications did mount, AS IT SHOULD IT"S INSIDE THE ACCOUNT HEADER`)
    }

    // INside comments have it fetch to the database to save the comment, save the comment ind atabase get back the data that it's successfully saved and then pass in the response to a prop that we get here from the comment component.. Save for the Like component
    // componentWillReceiveProps(){
    //     console.log(`notifications will recieve props`)
    //     console.log(this.props.notifications)
    // }

    // shouldComponentUpdate(){
        
    //         console.log(`should component update`)
    //         console.log(this.props.notifications)
        
    // }

    render(){
        return(
            <li>
                        <NavLink to='/profile/notifications'>
                            <div style={{width: '20px', height: '20px', border: '1px solid gray', borderRadius: '2px', position: 'relative'}}>

                                <div style={{position: 'absolute', right: '-5px', top: '-5px', backgroundColor: 'green', borderRadius: '50%', width: '10px', height: '10px'}}>
                                
                                </div>
                            </div>
                        </NavLink>
                    </li>
        )
    }
}


export default Notifications