import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData, sendUserData } from '../util/serverFetch';
import Search from './Search';
import ConfirmAction from './ConfirmAction';
import { connect } from 'react-redux';
import AccountVerify from './AccountVerify';



class Explore extends Component{
    constructor(props){
        super(props);

        this.state = {
            streamData: [],
            error: false,
            isLoading: false,
            hasMore: true,
            scrollCount: 0,
            searchQuery: {},
            submitLoad: false,
            errorMessage: '',
            statusMessage: '',
            showConfirmation: false,
            query: '',
            
        };

        
        this.loadData = this.loadData.bind(this);
        this.loadSearchData = this.loadSearchData.bind(this);
        this.getParameterByName = this.getParameterByName.bind(this);
        this.onScroll = this.onScroll.bind(this);

        
    }

    // Skip loading data if user is searching, load data on Explore and Feed pages
    componentDidMount(){

        window.addEventListener('scroll', this.onScroll);
        window.addEventListener('keydown', this.escModal);

        const{ endPoint, isSearching } = this.props;
        const { scrollCount } = this.state;
        const notAuthorized = !this.props.isAuth && endPoint === 'Feed';

        if(notAuthorized){
            this.setState({
                showAccountVerify: true,
                showConfirmation: true,
                actionSuccess: true,
                statusMessage: 'Log in or sign up to see the latest posts from people you follow!'
            });
        }
        else{
            // Have NotificationIcon in AccountNav see if there's new notifications
            this.props.dispatch({ type: 'CHECK_NOTIFICATION'});

        

            // No data needed on mount if user is searching for item
            if(isSearching) this.loadSearchData();
                
            // Only load data if end points are 'Explore' or 'Feed'
            if(endPoint){
                this.loadData(`/stream/${endPoint}/${scrollCount}`);
            }
        }

        
    }


    // If an authorized user types in lookid.com/feed their data will be retrieved instead of showing AccountVerify component
    componentDidUpdate(prevProps){

        if(this.props.isAuth && prevProps.isAuth !== this.props.isAuth && this.props.endPoint === 'Feed'){
            const { endPoint } = this.props;
            const { scrollCount } = this.state;

            this.setState({
                showAccountVerify: false,
                showConfirmation: false,
                actionSuccess: false,
            }, () => {
                this.loadData(`/stream/${endPoint}/${scrollCount}`);
            });
        }
    }

    // Remove event listener
    componentWillUnmount(){
        window.removeEventListener('scroll', this.onScroll);
        window.addEventListener('keydown', this.escModal);
    }

   

    getParameterByName(name, url) {
        // eslint-disable-next-line
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Loading data for stream routes (Express & Feed)
    loadData(url){


        const serverResponse = getData(url);
        this.setState({
            isLoading: true
        });

        // Get Profile Data
        serverResponse.then(response => response.json())
        .then((data) => {
            
            if(data.error) return Promise.reject(new Error(data.error));

            // If we're fetching data from scrolling
            if(this.state.isLoading){
                const currentData = this.state.streamData.map((post) => post);


                if(data.stream.length === 0){
                    const { endPoint } = this.props;
                    let statusMessage = 'Follow some of your favorite accounts to see their latest posts!';
                
                    if(endPoint === 'Explore') statusMessage = 'Looks like nobody has posted their outfits yet. Sign up and get the ball rolling!';

                    this.setState({
                        showConfirmation: true,
                        statusMessage: statusMessage,
                        actionSuccess: true,
                        isLoading: false,
                    });
                    return 1;
                }

                this.setState({
                    streamData: currentData.concat(data.stream),
                    isLoading: false,
                    hasMore: data.hasMore
                });
            }
            // Fetch from a page load
            else{
                this.setState({
                    streamData: data.stream
                });
            }
        })
        .catch((err) => {
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err.message);
        });
    }

    // Fetch data from search page
    loadSearchData(){


        const { scrollCount, submitLoad } = this.state;
        let search;

        if(this.props.urlParams){
            search = this.props.urlParams.location.search;
        }
        
        

        const query = this.getParameterByName('query', search);
        const price = this.getParameterByName('price', search);
        const color = this.getParameterByName('color', search);


        const data = {
            query: query,
            price: price,
            color: color,
            page: scrollCount
        };

        // If fetching data after a user submitted another query
        if(!submitLoad){
            this.setState({
                isLoading: true,
                query: query 
            });
        }


        const serverResponse = sendUserData(`/search/${scrollCount}`, data);

        // Get query items
        serverResponse.then(response => response.json())
        .then((data) => {
            
            if(data.error) return Promise.reject(new Error(data.error));
            if(data.stream.length === 0) return Promise.reject(new Error('Seems like we couldn\'t find any items matching your search.'));

            

            // Load data from scroll event
            if(this.state.isLoading){
                
                const { streamData } = this.state;

                this.setState({
                    streamData: streamData.concat(data.stream),
                    isLoading: false,
                    submitLoad: false,
                    hasMore: data.hasMore
                });
            }

            // Load data from query submit
            else{
                
                this.setState({
                    streamData: data.stream,
                    hasMore: data.hasMore
                });
            }
        })
        .catch((err) => {
            
            this.setState({
                showConfirmation: true,
                statusMessage: err.message
            });
            console.log(err.message);
        });
    }


    // for infinite scroll
    onScroll(){

        const  { error, isLoading, hasMore } = this.state;
        

        // Return if there's an error, already loading or there's no more data from the database
        if (error || isLoading || !hasMore) return;

        // Check if user has scrolled to the bottom of the page
        // different browser support
        if (window.innerHeight + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) >= document.documentElement.offsetHeight - 300) {
            
            // Using scrollCount to mimic pages
            const{ endPoint, isSearching } = this.props;
            const { scrollCount } = this.state;
            const newCount = scrollCount + 1;

            
            this.setState({
                scrollCount: newCount
            }, () => {
                
                // Get the new updated scrollCount
                const { scrollCount } = this.state;

                // Search routes or Explore/Feed routes
                if(endPoint) this.loadData(`/stream/${endPoint}/${scrollCount}`);
                if(isSearching) this.loadSearchData();
            });  
        }
    }



    render(){
        
        const { endPoint, isSearching } = this.props;
        const { showAccountVerify } = this.state;
        const showSearch = endPoint !== 'Feed';

        let pageName;
        
        
        // Have the page name equal to the item query, 'Explore', or 'Feed'
        if(isSearching){
            pageName = this.state.query;
        }
        else{
            pageName = endPoint;
        }
        

        return(
            <section className='container content'>
                {showSearch &&
                    <Search handleSearch={this.handleSearch}/>
                }
                    
                
                <PageHead pageHead={pageName} />
                {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                }
                <Stream sourceFetch='stream' stream={this.state.streamData}/>

                {showAccountVerify &&
                    <AccountVerify noModal={true}/>}
            </section>
        )
    }
}


function mapStateToProps(state){
    return{
        notifications: state.notifications,
        isAuth: state.isAuth
    }
}

export default connect(mapStateToProps)(Explore);