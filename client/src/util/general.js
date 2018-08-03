function prefixURL(url){
    
    if(!url) return url;
    
    const prefix = 'https://';
    let newURL = url;

    if (!url.match(/^[a-zA-Z]+:\/\//))
    {
    newURL = `${prefix}${url}`;
    }

    return newURL;
}

export { prefixURL };

