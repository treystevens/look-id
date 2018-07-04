import React, { Component } from 'react';

class Item extends Component{
    constructor(props){
        super(props);


        this.handleDelete = this.handleDelete.bind(this)
    }


    handleDelete(evt){
        console.log(evt.target);


        this.props.deleteItem(this.props.itemNumber);
    }

    render(){
        return(
                <div style={{display: 'flex', flexFlow: 'row wrap', position: 'relative', width: '30%'}}>
                    <div style={{position: 'absolute', right: '5px', top: '5px'}} onClick={this.handleDelete}>Close</div>
                    <label>Item Name:
                        <input type="text" name='itemname' />
                    </label>
                    <label>Category:
                        <input type="text" name='itemcategory' />
                    </label>
                    <label>Color:
                        <input type="text" name='itemcolor' />
                    </label>
                    <div style={{display: 'flex'}}>
                        <label>$
                            <input type="text" name='itemprice'/>
                        </label>
                        <label>Thrifted
                            <input type="checkbox" name='itemthrifted'/>
                        </label>
                    </div>
                    <label>Store
                        <input type="text" name='itemstore'/>
                    </label>
                    <label>Online Link
                        <input type="text" name='itemlink'/>
                    </label>
                </div>
        )
    }
}



export default Item;

