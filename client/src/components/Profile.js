import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import UserProfileHead from './UserProfileHead';
import { getData } from '../util/serverFetch';
import NotFound from './NotFound';
import { connect } from 'react-redux';


class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            userProfileHead: {},
            streamData: [],
            iFollow: false,
            isLoading: false,
            isSearching: false,
            hasMore: true,
            scrollCount: 0,
            initialLoad: false,
            notFound: false
        };

        this.handleFollowerCount = this.handleFollowerCount.bind(this);
        this.handleFollowingCount = this.handleFollowingCount.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    


    // Get the requested user's profile data
    componentDidMount(){

        window.addEventListener('scroll', this.onScroll);

        // Have NotificationIcon in AccountHead see if there's new notifications
        this.props.dispatch({ type: 'CHECK_NOTIFICATION'});

        this.loadData();
    }

    // Remove event listener
    componentWillUnmount(){
        window.removeEventListener('scroll', this.onScroll);
    }

    loadData(){
        const urlParamUser = this.props.urlParams.match.params.user;
        const { scrollCount, streamData, initialLoad } = this.state;
        const serverResponse = getData(`/user/${urlParamUser}/page/${scrollCount}`);


        // Fetch Data
        serverResponse.then(response => response.json())
        .then((data) => {

            if(data.error) return Promise.reject(new Error(data.error))
            

            if(initialLoad){
                this.setState({
                    streamData: streamData.concat(data.stream),
                    hasMore: data.hasMore
                });
            }
            else{
                this.setState({
                    userProfileHead: data.user,
                    streamData: streamData.concat(data.stream),
                    iFollow: data.iFollow,
                    initialLoad: true,
                    hasMore: data.hasMore
                });
            }

            
        })
        .catch((err) => {
            this.setState({
                notFound: true
            });
            console.log(err);
        });
    }

    onScroll(){


        const { error, isLoading, hasMore } = this.state;

        // Return if there's an error, already loading or there's no more data from the database
        if (error || isLoading || !hasMore) return;

        // Checks that the page has scrolled to the bottom
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            
            
            const { scrollCount } = this.state;
            const newCount = scrollCount + 1;

            this.setState({
                scrollCount: newCount

            }, () => {

                this.loadData();
            });
        }
    }
   

    // Passed down to FollowButton Component
    handleFollowerCount(isFollowing){     

        // Follower count is nested inside our user profile head
        const updateFollowerCount = Object.assign({}, this.state.userProfileHead);

        // If we follow update count and switch FollowButton component text to 'Unfollow'
        if(isFollowing){
            updateFollowerCount.followerCount += 1;

            this.setState({
                iFollow: true,
                userProfileHead: updateFollowerCount
            });
        }
        else{
            updateFollowerCount.followerCount -= 1;

            this.setState({
                iFollow: false,
                userProfileHead: updateFollowerCount
            });
        }
    }

    // Passed down to FollowButton Component with FF Component as Ancestor
    handleFollowingCount(){
        const updateFollowingCount = Object.assign({}, this.state.userProfileHead);
        
        updateFollowingCount.followingCount -= 1;

        this.setState({
            userProfileHead: updateFollowingCount
        });

    }
      
    render(){
    
        // Reference the requested user
        const user = this.props.urlParams.match.params.user;
        
        const { notFound } = this.state;

        if(notFound) return <NotFound />
        return(
            <section>
                <PageHead pageHead='Profile' />
                <UserProfileHead urlParamUser={user} data={this.state.userProfileHead} iFollow={this.state.iFollow} handleClickFollowText={this.handleClickFollowText} handleFollowerCount={this.handleFollowerCount} handleFollowingCount={this.handleFollowingCount}/>
                <Stream sourceFetch='profile' stream={this.state.streamData}/>
            </section>
        )
    }
}

function mapStateToProps(state){
    return{
        notifications: state.notifications
    }
}

export default connect(mapStateToProps)(Profile);