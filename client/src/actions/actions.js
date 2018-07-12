
function addAuth(user){
    return {
        type: 'AUTHENTICATE', 
        user: user.username,
    };
   
}

function updateAvatar(avatarLink){
    return {
        type: 'UPDATE_AVATAR', 
        updateAvatar: avatarLink
    };
}

export { addAuth, updateAvatar };