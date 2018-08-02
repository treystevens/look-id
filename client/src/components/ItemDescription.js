import React from 'react';
import { prefixURL } from '../util/general';
import './PostItems.css';




const ItemDescription = (props) => {

    const itemLink = prefixURL(props.item.link);
    let storeLength = props.item.stores.length;

    // Map out the stores ( they are passed as an array of stores )
    const stores = props.item.stores.map((store, index) => {
        
        let displayStore = `${store},`;
        if(index === storeLength - 1) displayStore = store;


        return <div key={`${props.itemNumber}-store${index}`} className='store'>{displayStore}</div>
    }); 


    return(
        <article className='pi-item'>
            <span className='pi-item__name'>{props.item.name}</span>

            {props.item.price &&
                <span className='pi-item__price'>${props.item.price}</span>
            }

            {props.item.thrifted && 
                <span>Thrifted</span>}

            <div className='pi-item__stores'>
                
                {stores}
            </div>
                {itemLink && 
                <div>
                    <a href={itemLink} target='_blank' className='pi-item__link'>Link to Item</a>
                </div>
                }
            
        </article>
    )
}

export default ItemDescription;