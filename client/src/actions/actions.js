
function addAuth(user){
    return {
        type: 'AUTHENTICATE', 
        user: user.username,
    }; 
}


export { addAuth };