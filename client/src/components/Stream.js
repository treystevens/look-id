import React, { Component } from 'react';
import StreamItem from './StreamItem';


/* jshint ignore:start */

class Stream extends Component{
    constructor(props){
        super(props);
    }

    render(){

        let listItems;
        let postData;
        
        if(this.props.data){
            postData = this.props.data.posts
        }

        if(this.props.sourceFetch === 'feed'){
            listItems = this.props.data.posts.map( (item) => {
                return <StreamItem stream={item} usernameHeader={this.props.data.username}/>
            })
        }
    
        if(this.props.sourceFetch === 'explore' && postData !== undefined){
            listItems = this.props.data.posts.map( (item) => {
                return <StreamItem stream={item.post} usernameHeader={true} username={item.username} explore='explore' key={item._id}/>
            })
        }

        if(this.props.sourceFetch === 'profile' && postData !== undefined){
            listItems = this.props.data.posts.map( (item) => {
                return <StreamItem stream={item} username={this.props.data.username} key={item._id}/>
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