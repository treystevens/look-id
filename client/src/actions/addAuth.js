
function addAuth(user){
    return {
        type: 'AUTHENTICATE', 
        user: user.username,
        avatar: user.avatar
    };
   
}

export { addAuth };