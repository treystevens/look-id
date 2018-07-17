import React, { Component } from 'react';
import StreamItem from './StreamItem';


const Stream = (props) => {

    let listPosts;
    let postData;

    // Boolean to check if we should add a username header to our stream of posts
    const sourceFetch = props.sourceFetch === 'stream';

    if(props.stream){
        postData = props.stream;
    }

    if(postData !== undefined){
        listPosts = props.stream.map( (post) => {
            return <StreamItem post={post} usernameHeader={sourceFetch} key={post._id}/>
        })
    }

    return(
        <div>
            <div className="testMore">
                {listPosts}
            </div>
        </div>
    )
}



export default Stream;
