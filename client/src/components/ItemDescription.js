import React from 'react';
// import FindStores from './FindStores'


const ItemDescription = (props) => {
    console.log(props);
    console.log(props.item.stores);

    return(
        <article style={{display: 'flex', flexDirection: 'column'}}>
            <h3>{props.item.name}</h3>
            <span>${props.item.price}</span>
            {props.item.thrifted && 
                <span>Thrifted</span>}
            <div style={{display: 'flex'}}>
                {props.item.link && 
                    <a href={`http://www.${props.item.link}`} target='_blank'>Link to Item</a>
                }
                <div style={{display: 'flex', flexDirection: 'column'}}>
                {props.item.stores.map((store) => {
                    return <span>{store}</span>
                }) }
                </div>
                {/* <FindStores stores={props.item.stores} /> */}
            </div>
        </article>
    )
}

export default ItemDescription;