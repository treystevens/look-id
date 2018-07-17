import React, { Component } from 'react';
import PageHead from './PageHead';
import Comments from './Comments';
import OtherPosts from './OtherPosts';
import ItemDescription from './ItemDescription';
import { getData } from '../util/serverFetch';
import PostImage from './PostImage';


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
            caption: '',
            postID: '',
            dataLoaded: false,
            showOtherPosts: false
        };

        this.shuffle = this.shuffle.bind(this);
        
    }

    // Fisher-Yates Shuffle
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
        

    // Retrieve Posts, Comments, Other Posts and Items
    componentDidMount(){
        

        const urlUsernameParam = this.props.urlParams.match.params.user;
        const urlPostID = this.props.urlParams.match.params.postid;
        const serverResponse = getData(`/user/${urlUsernameParam}/${urlPostID}`);

        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {

            const otherPostLength = data.otherPosts.length;
            
            let showOtherPosts;
            if(otherPostLength > 0){
                showOtherPosts = true;
            }

            // Make sure this post doens't show up in other post
            let filteredOtherPosts = data.otherPosts.filter((post) => {
                if(post.post_id !== urlPostID) return post;
            });

            // Shuffle and slice for 'Other Posts' section
            const shuffledOtherPosts = this.shuffle(filteredOtherPosts);
            const slicedOtherPosts = shuffledOtherPosts.slice(0, 4);

            this.setState({
                username: data.post.username,
                image: data.post.image,
                comments: data.post.comments,
                caption: data.post.caption,
                otherPosts: slicedOtherPosts,
                items: data.post.items,
                postID: data.post.post_id,
                dataLoaded: true,
                showOtherPosts: showOtherPosts,
            });
        })
        .catch((err) => {
            console.log(err);
        });
    
    }

    render(){

        let clothingItems;
        let otherPosts;
        
        const urlUsernameParam = this.props.urlParams.match.params.user;
        const urlPostID = this.props.urlParams.match.params.postid;
        const urlParams = {
            username: urlUsernameParam,
            postID: urlPostID
        };

        if(this.state.dataLoaded) {
            clothingItems = this.state.items.map((item) => {
                return <ItemDescription item={item} />
            })
        }

        if(this.state.otherPosts){
            otherPosts = this.state.otherPosts.map((post)=> {
                return <OtherPosts post={post} username={this.state.username} key={post._id}/>
            })
        }

        return(
            <div>
                <PageHead pageHead={this.state.username} post={true}/>
                <div style={{display: 'flex', width: '100%'}}>
                    <PostImage image={this.state.image} urlParams={urlParams} />
                    <div>
                        <h2 style={{margin: '0'}}>{this.state.caption}</h2>
                        {clothingItems}    
                    </div>
                </div>
                <section style={{display: 'flex'}}>
                    <div className="comments" style={{marginTop: '40px', width: '30%'}}>
                        <Comments comments={this.state.comments} urlParams={urlParams}/>
                    </div>
                    {this.state.showOtherPosts &&
                    <div className="otherPosts">
                        <h2>Other Posts</h2>
                        <div style={{width: '60%'}}>
                           {otherPosts}
                        </div>
                    </div>
                    }
                </section>   
            </div>
        )
    }

}

export default Post;