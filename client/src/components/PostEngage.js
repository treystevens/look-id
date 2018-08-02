import React from 'react';

// Bring comment into view when clicking on comment icon
function focusComment(){
    const commentBox = document.querySelector('.comment__box');
    commentBox.focus();
    commentBox.scrollIntoView();
}

const PostEngage = (props) => {

    let likeCount = props.likeCount;
    let heartSVG;
    
    if(likeCount === 0){
        likeCount = '';
    }

    // Filled heart SVG (User liked post)
    if(props.iLiked){
        heartSVG = (<svg onClick={props.handleLikeCount} enableBackground="new 0 0 50 50" height="50" width="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="m24.85 10.126c2.018-4.783 6.628-8.125 11.99-8.125 7.223 0 12.425 6.179 13.079 13.543 0 0 .353 1.828-.424 5.119-1.058 4.482-3.545 8.464-6.898 11.503l-17.747 15.834-17.448-15.835c-3.353-3.038-5.84-7.021-6.898-11.503-.777-3.291-.424-5.119-.424-5.119.654-7.364 5.856-13.543 13.079-13.543 5.363 0 9.673 3.343 11.691 8.126z" fill="#d75a4a"/></svg>)
    }
    else{
        // Empty heart SVG (User does not like post) 
        heartSVG = (<svg className='post__engage-heart--hover' height="50" width="50" onClick={props.handleLikeCount} enableBackground="new 0 0 51.997 51.997" viewBox="0 0 51.997 51.997" xmlns="http://www.w3.org/2000/svg"><path d="m51.911 16.242c-.759-8.354-6.672-14.415-14.072-14.415-4.93 0-9.444 2.653-11.984 6.905-2.517-4.307-6.846-6.906-11.697-6.906-7.399 0-13.313 6.061-14.071 14.415-.06.369-.306 2.311.442 5.478 1.078 4.568 3.568 8.723 7.199 12.013l18.115 16.439 18.426-16.438c3.631-3.291 6.121-7.445 7.199-12.014.748-3.166.502-5.108.443-5.477zm-2.39 5.019c-.984 4.172-3.265 7.973-6.59 10.985l-17.076 15.235-16.783-15.231c-3.331-3.018-5.611-6.818-6.596-10.99-.708-2.997-.417-4.69-.416-4.701l.015-.101c.65-7.319 5.731-12.632 12.083-12.632 4.687 0 8.813 2.88 10.771 7.515l.921 2.183.921-2.183c1.927-4.564 6.271-7.514 11.069-7.514 6.351 0 11.433 5.313 12.096 12.727.002.016.293 1.71-.415 4.707z"/></svg>)
        
    }
    
    return(
        <section className='post__engage'>
            <div className='post__engage-heart-container'>
                {heartSVG}
                <span className='post__engage-count'>{likeCount}</span>
            </div>

            {/* Comment Box */}
            <svg className='post__engage-icon' onClick={focusComment} enableBackground="new 0 0 473 473" viewBox="0 0 473 473" xmlns="http://www.w3.org/2000/svg"><path d="m403.581 69.3c-44.7-44.7-104-69.3-167.2-69.3s-122.5 24.6-167.2 69.3c-86.4 86.4-92.4 224.7-14.9 318-7.6 15.3-19.8 33.1-37.9 42-8.7 4.3-13.6 13.6-12.1 23.2s8.9 17.1 18.5 18.6c4.5.7 10.9 1.4 18.7 1.4 20.9 0 51.7-4.9 83.2-27.6 35.1 18.9 73.5 28.1 111.6 28.1 61.2 0 121.8-23.7 167.4-69.3 44.7-44.7 69.3-104 69.3-167.2s-24.7-122.5-69.4-167.2zm-19.1 315.3c-67.5 67.5-172 80.9-254.2 32.6-5.4-3.2-12.1-2.2-16.4 2.1-.4.2-.8.5-1.1.8-27.1 21-53.7 25.4-71.3 25.4h-.1c20.3-14.8 33.1-36.8 40.6-53.9 1.2-2.9 1.4-5.9.7-8.7-.3-2.7-1.4-5.4-3.3-7.6-73.2-82.7-69.4-208.7 8.8-286.9 81.7-81.7 214.6-81.7 296.2 0 81.8 81.7 81.8 214.5.1 296.2z"/><circle cx="236.381" cy="236.5" r="16.6"/><circle cx="321.981" cy="236.5" r="16.6"/><circle cx="150.781" cy="236.5" r="16.6"/></svg>
        
            {/* Plus Board Icon */}
            <svg className='post__engage-icon' enableBackground="new 0 0 52 52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" onClick={props.openBoards} ><path d="m26 0c-14.336 0-26 11.663-26 26s11.664 26 26 26 26-11.663 26-26-11.664-26-26-26zm0 50c-13.233 0-24-10.767-24-24s10.767-24 24-24 24 10.767 24 24-10.767 24-24 24z"/><path d="m38.5 25h-11.5v-11c0-.553-.448-1-1-1s-1 .447-1 1v11h-11.5c-.552 0-1 .447-1 1s.448 1 1 1h11.5v12c0 .553.448 1 1 1s1-.447 1-1v-12h11.5c.552 0 1-.447 1-1s-.448-1-1-1z"/></svg>
            
        </section>
    )
}

export default PostEngage;