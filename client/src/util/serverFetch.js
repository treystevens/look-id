function sendUserData(url, data){
    let userFetch = fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    })
    .then((res) => {
        console.log(res);
        return res;
    })
    .catch((err) => {
        console.log(err);
    });

    return userFetch;
}

function getData(url){
    let userFetch = fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then((res) => {
        console.log(res);
        return res;
    })
    .catch((err) => {
        console.log(err);
    });

    return userFetch;
}

function sendPhoto(url, formData){
    let userFetch = fetch(url, {
        body: formData,
        method: 'POST',
        credentials: 'include'
    })
    .then((res) => {
        console.log(res);
        return res; 
    })
    .catch((err) => {
        console.log(err);
    });

    return userFetch;
}

export { sendUserData, getData, sendPhoto };