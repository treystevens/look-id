import React, { Component } from 'react';
import PostDescription from './PostDescription';
import PageHead from './PageHead';
import PostEngage from './PostEngage';
import Modal from './Modal';
import Comments from './Comments';
import OtherPosts from './OtherPosts';
import ItemDescription from './ItemDescription';
import Notifications from './Notifications';




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
            descriptions: [
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
            description: '',
            comments: {},
            otherPosts: [],
            username: '',
            postImage: '',
            showModal: false,
            likeCount: '',
            liked: true,
            postCaption: ''
       
        }


        this.openBoards = this.openBoards.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleLikeCount = this.handleLikeCount.bind(this);
    }



    openBoards(){
        console.log('opening')
        this.setState({
            showModal: true
        })
       
    }

    closeModal(evt){
        if(evt.target.className === 'modal'){
            this.setState({
                showModal: false
            });
        }   
    }

    // Post is fetching the data from the user and post ID..so user/jacob/1203819023
    // Someone clicks the above link and is brought here. User clicks lookid.com/user/jacob/1203819023.. on the server it's looking for GET requests on '/user/:username/:postid' and fetches the post id from the database and the username and then give it back to this page

    componentDidUpdate(){
        console.log(`I believe I just finished clicking the heart so this component updated because the state was updated`)
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

    // componentWillMount(){

    // }

    componentWillMount(){
        
        console.log(this.props.urlParams.match.params.postid)
        console.log(this.props.urlParams.match.params.user)
        console.log(this.props.urlParams)

        // IF your username is found inside the posts[0].liked then set the liked:true

        this.setState({
            username: this.props.urlParams.match.params.user,
            post_image: user1.posts[0].image,
            likeCount: user1.posts[0].likes,
            comments: user1.posts[0].comments,
            postCaption: user1.posts[0].post_caption,
            otherPosts: user1.other_posts,
            description: user1.posts[0].descriptions
        })

        // Make a fetch request to the user and post id from the match params

        

        // You're going to have to extract the posts array and map it into a new one so "user1" won't be the thing that you use

    

        console.log(`laoded`)

        let sendToPostDescript = user1.posts[0].descriptions.map((item) => {
            return <ItemDescription description={item} />
        })


        this.setState({
            description: sendToPostDescript
        })

    


    }
//  Or make PostEngage on the state and return it down there

    render(){
        return(
            <div>
                <PageHead pageHead={this.state.username}/>
                <div style={{display: 'flex', width: '100%'}}>
                    <div className='postHead' style={ {"width": "40%"}}>
                        <img src={this.state.post_image} style={ {"width": "100%"}}/>

                        <PostEngage openBoards={this.openBoards} commentCount={this.state.commentCount} likeCount={this.state.likeCount} handleLikeCount={this.handleLikeCount}/>
                    </div>
                    <div>
                        <h2 style={{margin: '0'}}>{this.state.postCaption}</h2>
                        {this.state.description}
                    </div>
                </div>
                <section style={{display: 'flex'}}>
                    <div className="comments" style={{marginTop: '40px', width: '30%'}}>
                        <Comments comments={this.state.comments}/>
                        {/* {this.state.comments} */}
                        {/* <a href="/viewallcomments">View all comments</a> */}
                    </div>
                    <div className="otherPosts">
                        <h2>Other Posts</h2>
                        <div style={{width: '60%'}}>
                            {this.state.otherPosts.map((post)=> {
                                return <OtherPosts post={post} username={this.state.username}/>
                            })}
                        </div>
                    </div>
                </section>
                {this.state.showModal && <Modal source="addToBoard" closeModal={this.closeModal} postImage={this.state.postImage}/>}
                
            </div>
        )
    }

}

export default Post;