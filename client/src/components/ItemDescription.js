import React from 'react';

const ItemDescription = (props) => {

    const prefix = 'https://';
    let itemLink = props.item.link;


    // prepend https to link if not present
    if(itemLink){
        if (!props.item.link.match(/^[a-zA-Z]+:\/\//))
        {
        itemLink = `${prefix}${props.item.link}`;
        }
    }

    // Map out the stores ( they are passed as an array of stores )
    const stores = props.item.stores.map((store, index) => {
        
        return <div key={`${props.itemNumber}-store${index}`}>{store}</div>
    }); 


    return(
        <article style={{display: 'flex', flexDirection: 'column'}}>
            <h3>{props.item.name}</h3>

            {props.item.price &&
                <span>${props.item.price}</span>
            }

            {props.item.thrifted && 
                <span>Thrifted</span>}

            <div style={{display: 'flex'}}>

                {itemLink && 
                    <a href={itemLink} target='_blank'>Link to Item</a>
                }
                
                {stores}
       
            </div>
        </article>
    )
}

export default ItemDescription;