import React, { Component } from 'react';

class UploadItem extends Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props.itemNumber)

        console.log(`itemname${this.props.itemNumber}`)
        let itemName = `item-name-${this.props.itemNumber}`
        let itemCategory = `item-category-${this.props.itemNumber}`;
        let itemColor = `item-color-${this.props.itemNumber}`;
        let itemPrice = `item-price-${this.props.itemNumber}`;
        let itemStore = `item-store-${this.props.itemNumber}`;
        let itemLink = `item-link-${this.props.itemNumber}`;

        return(
                <fieldset name="item" style={{display: 'flex', flexFlow: 'row wrap'}}>
                    <label>Item Name:
                        <input type="text" name='item-name' />
                    </label>
                    <label>Category:
                        <input type="text" name='item-category' />
                    </label>
                    <label>Color:
                        <input type="text" name='item-color' />
                    </label>
                    <div style={{display: 'flex'}}>
                        <label>$
                            <input type="text" name='item-price'/>
                        </label>
                        <label>Thrifted
                            <input type="checkbox" name='item-thrifted'/>
                        </label>
                    </div>
                    <label>Store
                        <input type="text" name='item-store'/>
                    </label>
                    <label>Online Link
                        <input type="text" name='item-link'/>
                    </label>
                </fieldset>
        )
    }
}


export default UploadItem;

