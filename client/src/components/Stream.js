import React from 'react';
import StreamItem from './StreamItem';
import StackGrid from "react-stack-grid";
import './Stream.css';


const Stream = (props) => {

    const windowWidth = window.innerWidth;
    let listPosts;
    let postData;
    let colWidth;

    if(windowWidth <= 600) colWidth = '45%';
    if(windowWidth >= 600) colWidth = '30%';
    


    // Boolean to check if we should add a username header to our stream of posts
    const sourceFetch = props.sourceFetch === 'stream';

    if(props.stream){
        postData = props.stream;
    }

    if(postData !== undefined){
        listPosts = props.stream.map( (post) => {
            return <StreamItem post={post} usernameHeader={sourceFetch} key={post._id} edit={props.edit} handlePostDelete={props.handlePostDelete}/>
        })
    }
    

    return(
        <section className='stream'>
            <StackGrid columnWidth={colWidth} monitorImagesLoaded={true} gutterWidth={10} gutterHeight={5}>
                {listPosts}
            </StackGrid>
        </section>
    )
}



export default Stream;
