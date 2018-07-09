import React, { Component } from 'react';
// import PostDescription from './PostDescription';
import PageHead from './PageHead';
import PostEngage from './PostEngage';
import Modal from './Modal';
import Comments from './Comments';
import OtherPosts from './OtherPosts';
import ItemDescription from './ItemDescription';
import Notifications from './Notifications';
import { getData } from '../util/serverFetch';
import PostImage from './PostImage';





const user1 = {
    user_id: "001",
    username: "Chocolate",
    display_picture: "",
    posts:[
        {
            
            post_id: "1234",
            post_caption: "Weather so breezy, man why can't life always be this easy?",
            image: "/lookid/boards/images/1.jpg",
            image_id: "01",
            likes: 32,
            comments:  [
                    {
                        username: "Jacob",
                        user_id: "09",
                        date_posted: "June 16, 2018",
                        comment: "Wow, this is amazing can't believe you really did",
                        display_picture:"/lookid/fit3.jpg"
                    },
                    {
                        username: "Corn",
                        user_id: "12",
                        date_posted: "June 14, 2018",
                        comment: "This looks awesome",
                        display_picture:"/lookid/fit4.jpg"
                    },
                    {
                        username: "Paul",
                        user_id: "0030",
                        date_posted: "June 13, 2018",
                        comment: "I'm buying this right away!",
                        display_picture:"/lookid/fit7.jpg"
                    },

                ],
            timestamp: "",
            items: [
                {
                category: "Accesory",
                name: "Scarf",
                price: "32.50",
                stores: ["H&M", "Nordstrom"],
                online_link: "https://shop.nordstrom.com/",
                description: "gray scarf"
            },
            {
                category: "Jacket",
                name: "Peacoat",
                price: "152.50",
                stores: ["Nordstrom"],
                online_link: "https://shop.nordstrom.com/",
                description: "Pea coat jacket"
            }
        ]
        
        }
    ],
    other_posts: [
        {post_id: 94021, image: "/lookid/kfit1.jpg"}, 
        {post_id: 94022,image: "/lookid/kfit2.jpg"}, 
        {post_id: 94023,image: "/lookid/kfit3.jpg"}, 
        {post_id: 94024,image: "/lookid/kfit4.jpg"}]

};


class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: '',
            comments: [],
            otherPosts: [],
            username: '',
            image: '',
            showModal: false,
            likeCount: '',
            liked: true,
            caption: '',
            postID: '',
            dataLoaded: false
       
        };

        this.openBoards = this.openBoards.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleLikeCount = this.handleLikeCount.bind(this);
    }

    openBoards(){
        this.setState({
            showModal: true
        });
       
    }

    closeModal(evt){
        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false
            });
        }   
    }

    handleLikeCount(){
        let count = this.state.likeCount;

        let dummyData = {
            username: 'hatface',
            userid: '0201',
            date_posted: '(data)',
            display_picture: '/lookid/fit6.jpg'
        }

        if(this.state.liked){
            this.setState({
                likeCount: count - 1,
                liked: false
            }, () => {
                return <Notifications notification={dummyData} />
            });
            
            
        }
        else{
            // Change the image of the heart to be filled
            this.setState({
                likeCount: count + 1,
                liked: true
            })
        }

        



        
    }

    componentDidMount(){
        
    
        const urlUsernameParam = this.props.urlParams.match.params.user;
        const urlPostID = this.props.urlParams.match.params.postid
        const serverResponse = getData(`/user/${urlUsernameParam}/${urlPostID}`);

        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {
            console.log(data)

            this.setState({
                username: data.username,
                image: data.post.image,
                likeCount: data.post.likes,
                comments: data.post.comments,
                caption: data.post.caption,
                otherPosts: data.other_posts,
                items: data.post.items,
                postID: data.post.post_id,
                dataLoaded: true
            }, () => {
                console.log(this.state.items)
            })
        })
        .catch((err) => {
            console.log(err);
        });

        // IF your username is found inside the posts[0].liked then set the liked:true
    
    }

    
//  Or make PostEngage on the state and return it down there

    render(){

        let clothingItems;
        
        const urlUsernameParam = this.props.urlParams.match.params.user;
        const urlPostID = this.props.urlParams.match.params.postid;
        const urlParams = {
            username: urlUsernameParam,
            postID: urlPostID
        }

        if(this.state.dataLoaded) {
            clothingItems = this.state.items.map((item) => {
                console.log(item)
                return <ItemDescription item={item} />
            })
        }
        
        

        return(
            <div>
                <PageHead pageHead={this.state.username} post={true}/>
                <div style={{display: 'flex', width: '100%'}}>
                    <PostImage image={this.state.image} urlParams={urlParams}/>
                    <div>
                        <h2 style={{margin: '0'}}>{this.state.caption}</h2>
                        {clothingItems}
                        
                    </div>
                </div>
                <section style={{display: 'flex'}}>
                    <div className="comments" style={{marginTop: '40px', width: '30%'}}>
                        <Comments comments={this.state.comments} urlParams={urlParams}/>
                        {/* {this.state.comments} */}
                        {/* <a href="/viewallcomments">View all comments</a> */}
                    </div>
                </section>
                
                
            </div>
        )
    }

}

export default Post;