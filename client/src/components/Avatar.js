import React, { Component } from 'react';
import { getData } from '../util/serverFetch';


// class Avatar extends Component{
//     constructor(props){
//         super(props);

//         this.state = {
//             avatarUrl: ''
//         };
//     }


//     render(){
//         return(
//             <div>
//                 <img src={this.state.avatarUrl} alt=''
//             </div>
//         )
//     }
// }


const Avatar = (props) => {

    let imgAlt = `${props.userUsername}'s profile picture'`;

    return(
        <div style={{width: '80px', height: '80px', borderRadius: '50%', overflow:'hidden'}}>
            <img src={props.avatarUrl} alt={imgAlt} style={{width: '100%'}}/>
        </div>
    )
}

export default Avatar;

