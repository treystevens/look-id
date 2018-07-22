function sendUserData(url, data){
    return fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    });
}

function getData(url){
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    });
}

function sendPhoto(url, formData){
    return fetch(url, {
        body: formData,
        method: 'POST',
        credentials: 'include'
    });
    
}

function goDelete(url){
    return fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });
}

export { sendUserData, getData, sendPhoto, goDelete };