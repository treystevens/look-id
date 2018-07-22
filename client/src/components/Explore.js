import React, { Component } from 'react';
import Stream from './Stream';
import PageHead from './PageHead';
import { getData, sendUserData } from '../util/serverFetch';
import Search from './Search';

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
            submitLoad: false
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadSearchData = this.loadSearchData.bind(this);

        // Binds our scroll event handler
        window.onscroll = () => {

            const  { error, isLoading, hasMore } = this.state;
            

            // Return if there's an error, already loading or there's no more data from the database
            if (error || isLoading || !hasMore) return;
    
            // Check if user has scrolled to the bottom of the page
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                
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
        };
        
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


            // If we're fetching data from scrolling
            if(this.state.isLoading){
                const {streamData} = this.state;
                const currentData = this.state.streamData.map((post) => post);
                

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
            console.log(err);
        });
    }

    // Fetch data from search page
    loadSearchData(){
     

        const { scrollCount, submitLoad, searchQuery: { query, price, color } } = this.state;
        
        
        // If fetching data after a user submitted another query
        if(!submitLoad){
            this.setState({
                isLoading: true
            });
        }

        const data = {
            query: query,
            price: price,
            color: color,
            page: scrollCount
        };


        const serverResponse = sendUserData(`/search/${scrollCount}`, data);

        // Get query items
        serverResponse.then(response => response.json())
        .then((data) => {

            // Load data from scroll event
            if(this.state.isLoading){

                const { streamData } = this.state;
                const currentData = this.state.streamData.map((post) => post);

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
            console.log(err);
        });
    }

    // Handle search query from Search component
    handleSearch(searchQuery){


        this.setState({
            searchQuery: searchQuery,
            submitLoad: true
        }, () => {
            this.loadSearchData();
        });

    }

    // Skip loading data if user is searching, load data on Explore and Feed pages
    componentDidMount(){


        const{ endPoint, isSearching } = this.props;
        const { scrollCount } = this.state;

        // No data needed on mount if user is searching for item
        if(isSearching) return;
                
        // Only load data if end points are 'Explore' or 'Feed'
        if(endPoint){
            this.loadData(`/stream/${endPoint}/${scrollCount}`);
        }
    }


    render(){

        const {endPoint, isSearching} = this.props;
        let pageName;
        
        // Have the page name equal to the item query, 'Explore', or 'Feed'
        if(isSearching){
            pageName = this.state.searchQuery.query;
        }
        else{
            pageName = endPoint;
        }
        

        return(
            <section>
                {isSearching &&
                    <Search handleSearch={this.handleSearch}/>
                }
                <PageHead pageHead={pageName} />
                <Stream sourceFetch='stream' stream={this.state.streamData}/>
            </section>
        )
    }
}


export default Explore