import React, { Component } from 'react';
import StreamItem from './StreamItem';
import PageHead from './PageHead';

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

        this.state = {
            posts: [],
            pageName: ''
        }


    }

    // The stream is going to take a prop from the parent compenont, so "explore, or feed" and then pass in then fetch for the certain explore or feed in database. make child components based on what is received. So basically pass in the receieved data to the children
    // Prop from parent component > fetch database > pass prop into StreamItem child componentn
    // Component did mount fetch to database
    // The fake data in our case would be our state when we load a component and update state
    componentDidMount(){

        // Alternative to the if's and else if's. 
        // fetch(`/${this.props.sourceFetch}`)
        // Make a /explore and /feed on server and handle those requests differently 

        // if(this.props.sourceFetch === 'explore'){

        // }
        // else if(this.props.sourceFetch === 'feed'){

        // }
        // make a key by let alpha = L, let count = 1; count++; let key = `l_${count}`;

        
       

        if(this.props.urlParams){
            this.setState({
                pageName: this.props.urlParams.match.params.user
            })
        }
        else{
            this.setState({
                pageName: this.props.pageName
            })
        }
        



        if(this.props.sourceFetch === 'feed'){

            let listItems = fakeData.map((item) => {
            
                return <StreamItem key={item.post.image_id} stream={item} usernameHeader={true}/>
            })
    
            this.setState({
                posts: listItems
            })
        }

        if(this.props.sourceFetch === 'profile'){

            let listItems = fakeData.map((item) => {
            
                return <StreamItem key={item.post.image_id} stream={item}/>
            })
    
            this.setState({
                posts: listItems
            })
        }

        if(this.props.sourceFetch === 'boards'){

            let listItems = boardData.board_images.map((item) => {
    
                return <StreamItem key={item.post.image_id} stream={item} usernameHeader={true}/>
            })
    
            this.setState({
                posts: listItems
            })
        }
        


    }

    render(){
        return(
            <div>
                <PageHead pageHead={this.state.pageName}/>
                <div className="testMore">
                    {this.state.posts}
                </div>
            </div>
        )
    }
}

export default Stream;

// Code here will be ignored by JSHint.
/* jshint ignore:end */