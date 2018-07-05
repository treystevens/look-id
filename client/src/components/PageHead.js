import React from 'react';
import { Link } from 'react-router-dom';

const PageHead = (props) => {

    let postPage;
    let profileLink;

    if(props.post){
        postPage = props.post;
        profileLink = `/user/${props.pageHead}`;
    }
    
    

    return(
        <section>
            {postPage ? (
                <Link to={profileLink}><h1>{props.pageHead}</h1></Link>
                ) : (
                <h1>{props.pageHead}</h1>
                )
            }
        </section>
    )
}

export default PageHead;