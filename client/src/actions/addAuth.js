
function addAuth(user){
    return {
        type: 'AUTHENTICATE', 
        user: user.username,
        userID: user.userID
    };
   
}

export { addAuth };