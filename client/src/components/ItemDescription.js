import React from 'react';
// import FindStores from './FindStores'


const ItemDescription = (props) => {



    return(
        <article style={{display: 'flex', flexDirection: 'column'}}>
            <h6>{props.description.name}</h6>
            <span>${props.description.price}</span>
            <div style={{display: 'flex'}}>
                <a href={props.description.online_link} target='_blank'>Link to Item</a>
                {props.description.stores.map((store) => {
                    return <span>{store}</span>
                })}
                {/* <FindStores stores={props.description.stores} /> */}
            </div>
        </article>
    )
}

export default ItemDescription;