import React, { Component } from 'react';
import StreamItem from './StreamItem';
import PageHead from './PageHead';
import { getData } from '../util/serverFetch';

/* jshint ignore:start */


let fakeData = [
    {
        "user_id": "1",
        "username": "jknowlem",
        "post": {
            "image": "/lookid/fit1.jpg",
            "image_id": "01"
        } 
    },
    {
        "user_id": "2",
        "username": "Happy Man",
        "post": {
            "image": "/lookid/fit2.jpg",
            "image_id": "02"
        } 
    },
    {
        "user_id": "3",
        "username": "Todo Food",
        "post": {
            "image": "/lookid/fit3.jpg",
            "image_id": "03"
        } 
    },
    {
        "user_id": "4",
        "username": "Bacon",
        "post": {
            "image": "/lookid/fit4.jpg",
            "image_id": "04"
        } 
    },
    {
        "user_id": "5",
        "username": "Jacob Sulli",
        "post": {
            "image": "/lookid/fit5.jpg",
            "image_id": "05"
        } 
    }
]

// Remember that you click on the board you want, search the database for that board from the user and bring back the board data. Fetch the specific board you clicked on, doesn't come back as an array but an object of that board.
const boardData = {
        board_id: "01",
        board_name: "Shoes I Want",
        board_display_image: "/lookid/boards/display/12.jpg",
        user: "jknow",
        "board_images": [
            {
                "user_id": "001",
                "username": "Chocolate",
                "post": {
                    "image": "/lookid/boards/images/1.jpg",
                    "image_id": "01"
                }
            },
            {
                "user_id": "002",
                "username": "HangHang",
                "post": {
                    "image": "/lookid/boards/images/2.jpg",
                    "image_id": "02"
                }
            },
            {
                "user_id": "003",
                "username": "Chuchuu",
                "post": {
                    "image": "/lookid/boards/images/3.jpg",
                    "image_id": "03"
                }
            },
            {
                "user_id": "004",
                "username": "Lucky",
                "post": {
                    "image": "/lookid/boards/images/4.jpg",
                    "image_id": "04"
                }
            },
            
        ],
    
    }
// function NumberList(props) {
//     const numbers = props.numbers;
//     const listItems = numbers.map((number) =>
//       // Correct! Key should be specified inside the array.
//       <ListItem key={number.toString()}
//                 value={number} />
  
//     );
//     return (
//       <ul>
//         {listItems}
//       </ul>
//     );
//   }

class Stream extends Component{
    constructor(props){
        super(props);
    }

  


    render(){

        let listItems;
        let postData = this.props.data.posts
        let propsData = this.props.data.stream;

        console.log(this.props)

        if(this.props.sourceFetch === 'feed'){
            listItems = this.props.data.posts.map( (item) => {
                return <StreamItem stream={item} usernameHeader={this.props.data.username}/>
            })
        }
    

        if(this.props.sourceFetch === 'explore' && postData !== undefined){
            console.log('we made it')
            listItems = this.props.data.posts.map( (item) => {
                console.log(item)
                return <StreamItem stream={item.post} usernameHeader={true} username={item.username} explore='explore'/>
            })
        }

        if(this.props.sourceFetch === 'profile' && postData !== undefined){
            listItems = this.props.data.posts.map( (item) => {
                return <StreamItem stream={item} username={this.props.data.username}/>
            })

        }
    
        if(this.props.sourceFetch === 'boards'){
            listItems = boardData.board_images.map((item) => {
                return <StreamItem stream={item} usernameHeader={true}/>
            })
        }




        return(
            <div>
                <div className="testMore">
                    {listItems}
                </div>
            </div>
        )
    }
}

export default Stream;

// Code here will be ignored by JSHint.
/* jshint ignore:end */