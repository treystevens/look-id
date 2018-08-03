import React, { Component } from 'react';
import PageHead from './PageHead';
import Comments from './Comments';
import OtherPosts from './OtherPosts';
import ItemDescription from './ItemDescription';
import { getData, goDelete } from '../util/serverFetch';
import PostImage from './PostImage';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import NotFound from './NotFound';
import ConfirmAction from './ConfirmAction';
import Button from './Button';
import './Post.css';


class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [],
            comments: [],
            otherPosts: [],
            username: '',
            image: '',
            caption: '',
            postID: '',
            dataLoaded: false,
            showOtherPosts: false,
            showOptions: false,
            redirect: false,
            notFound: false,
            showConfirmation: false,
            actionSuccess: false,
            statusMessage: ''
            
        };

        this.shuffle = this.shuffle.bind(this);
        this.handleDeletePost = this.handleDeletePost.bind(this);
        this.showOptions = this.showOptions.bind(this);
        this.escEditOptions = this.escEditOptions.bind(this);
    }

    // Retrieve Posts, Comments, Other Posts and Items
    componentDidMount(){
        window.addEventListener('click', this.escEditOptions);
        window.scrollTo(0, 0);

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
            });
            console.log(err);
        });
    
    }

    // Remove event listener
    componentWillUnmount(){
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('click', this.escEditOptions);
    }

    // Close edit options with click 
    escEditOptions(evt){
        if(this.state.showOptions && !evt.target.classList.contains('edit-option')&& !evt.target.classList.contains('btn')){
            this.setState({
                showOptions: false
            });
        }
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

    // Show Edit options
    showOptions(){
        
        const { showOptions } = this.state;

        if(showOptions){
            this.setState({
                showOptions: false
            });
        }
        else{
            this.setState({
                showOptions: true
            });
        }
    }

    // Delete a post
    handleDeletePost(evt){ 
        evt.preventDefault();

        const { username } = this.props;
        const urlPostID = this.props.urlParams.match.params.postid;
        
        // Request to delete post
        const serverResponse = goDelete(`/user/${username}/${urlPostID}`);

        serverResponse.then(response => response.json())
        .then((data) => {

            if(data.error) return Promise.reject(new Error(data.error));

            this.setState({
                redirect: true
            });
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err);
        }) ;

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
        const { redirect, notFound, showOptions } = this.state;

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
            <section className='container'>
                
                    <PageHead pageHead={this.state.username} post={true}/>
                    {authorized &&
                    
            



                    <div className='edit-container'>
                        <Button text='Edit' dummy={true} onClick={this.showOptions}/>
                            {showOptions &&
                            <div className='edit-dropdown'>
                                <ul className='edit-options'>
                                <Link to={`/user/${urlUser}/${urlPostID}/edit`}>
                                        <li className='edit-option'>Edit Post</li>
                                    </Link>
                                    <li onClick={this.handleDeletePost} className='edit-option  edit-option--caution'>Delete Post</li>
                                </ul>
                            </div>
                            }
                        
                    </div>
                    }


                    <section className='post'>
                        {this.state.showConfirmation &&
                                <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                            }

                        <section className='post__u-h'>

                            <PostImage image={this.state.image} urlParams={urlParams} />

                            <section className='u-r'>
                                <p className='u-r__caption'>{this.state.caption}</p>
                                <section className='pi-items'>
                                    {clothingItems}  
                                </section>
                            </section>

                        </section>
                        <section className='post__l-h'>
                            
                            <Comments comments={this.state.comments} urlParams={urlParams}/>
                            

                            {this.state.showOtherPosts &&
                            <section className='post__other-posts'>
                                <h2 className='other-posts__header'>Other Posts</h2>
                                <div className='other-posts'>
                                {otherPosts}
                                </div>
                            </section>
                            }
                        </section>  
                    </section> 
                
            </section>
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