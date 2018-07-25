import React, { Component } from 'react';
import PageHead from './PageHead';
import Comments from './Comments';
import OtherPosts from './OtherPosts';
import ItemDescription from './ItemDescription';
import { getData, sendUserData, goDelete } from '../util/serverFetch';
import PostImage from './PostImage';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import NotFound from './NotFound';


class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [],
            comments: [],
            otherPosts: [],
            username: '',
            image: '',
            showModal: false,
            caption: '',
            postID: '',
            dataLoaded: false,
            showOtherPosts: false,
            showPostOptions: false,
            redirect: false,
            notFound: false
            
        };

        this.shuffle = this.shuffle.bind(this);
        this.showPostOptions = this.showPostOptions.bind(this);
        this.handleDeletePost = this.handleDeletePost.bind(this);
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
        
    // Click event for post options
    showPostOptions(evt){
        evt.preventDefault();

        this.setState({
            showPostOptions: true
        });
    }

    handleDeletePost(evt){ 
        evt.preventDefault();

        const { username } = this.props;
        const urlPostID = this.props.urlParams.match.params.postid;
        
        // Request to delete post
        const serverResponse = goDelete(`/user/${username}/${urlPostID}`);

        serverResponse.then(response => response.json())
        .then(() => {
            this.setState({
                redirect: true
            });
        })
        .catch((err) => {
            console.log(err);
        }) ;

    }

    // Retrieve Posts, Comments, Other Posts and Items
    componentDidMount(){
        

        const urlUser = this.props.urlParams.match.params.user;
        const urlPostID = this.props.urlParams.match.params.postid;
        const serverResponse = getData(`/user/${urlUser}/${urlPostID}`);

        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {

            if(data.error) return Promise.reject(new Error(data.error));

            const otherPostLength = data.otherPosts.length;
            
            let showOtherPosts;
            if(otherPostLength > 0){
                showOtherPosts = true;
            }

            // Shuffle and slice for 'Other Posts' section
            const shuffledOtherPosts = this.shuffle(data.otherPosts);
            const slicedOtherPosts = shuffledOtherPosts.slice(0, 4);

            if(data.post.items){
                this.setState({
                    items: data.post.items.items,
                });
            }
            
            this.setState({
                username: data.post.username,
                image: data.post.image,
                comments: data.post.comments,
                caption: data.post.caption,
                otherPosts: slicedOtherPosts,
                postID: data.post.post_id,
                dataLoaded: true,
                showOtherPosts: showOtherPosts,
            }); 
        })
        .catch((err) => {
            this.setState({
                notFound: true
            })
            console.log(err);
        });
    
    }

    render(){

        let clothingItems;
        let otherPosts;
        
        const urlUser = this.props.urlParams.match.params.user;
        const urlPostID = this.props.urlParams.match.params.postid;
        const urlParams = {
            username: urlUser,
            postID: urlPostID
        };

        const authorized = this.props.username === urlUser && this.props.isAuth;
        const {redirect, notFound} = this.state;

        if(this.state.dataLoaded && this.state.items) {
            clothingItems = this.state.items.map((item, index) => {
                return <ItemDescription item={item} key={`item${index}`} itemNumber={`item${index}`}/>
            })
        }

        if(this.state.otherPosts){
            otherPosts = this.state.otherPosts.map((post)=> {
                return <OtherPosts post={post} username={this.state.username} key={post._id}/>
            })
        }

        // Redirect when deleting a post to user's profile
        if(redirect) return <Redirect to={`/user/${urlUser}`} />

        // 404 Not Found
        if(notFound) return <NotFound />

        return(
            <div>
                <PageHead pageHead={this.state.username} post={true}/>
                {authorized &&
                <div>
                    <Link to={`/user/${urlUser}/${urlPostID}/edit`}>Edit Post</Link>
                    <h5 onClick={this.handleDeletePost}>Delete Post!</h5>
                    </div>
                }
                <div style={{display: 'flex', width: '100%'}}>
                    <PostImage image={this.state.image} urlParams={urlParams} />
                    <div>
                        <h2 style={{margin: '0'}}>{this.state.caption}</h2>
                        {clothingItems}    
                    </div>
                </div>
                <section style={{display: 'flex'}}>
                    <div className="comments" style={{marginTop: '40px', width: '30%'}} >
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

function mapStateToProps(state){
    return{
        isAuth: state.isAuth,
        username: state.username
    }
}

export default connect(mapStateToProps)(Post);