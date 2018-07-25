import React, { Component } from 'react';
import Item from './Item';
import AddItem from './AddItem';


class ItemList extends Component{
    constructor(props){
        super(props);

        this.state = {
            addItemCount: 0,
            deleteItem: {}
        };

        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
    }

    // Add items
    handleAddItem(){

        // No more than 5 items
        if(this.state.addItemCount === 6){
            return 1;
        }
        this.setState({
            addItemCount: this.state.addItemCount + 1
        });
    }

    // Delete items
    handleDeleteItem(item){
        this.setState({
            addItemCount: this.state.addItemCount - 1,
            deleteItem: Object.assign(this.state.deleteItem, item)
        });
    }


    render(){

        const items = [];

        // When updating addItemCount on state add another item
        for (let i = 0; i < this.state.addItemCount; i += 1) {
            items.push(<Item key={i} itemNumber={i} deleteItem={this.handleDeleteItem}/>);
        };
        
        return(
            <section>
                    {items}
                    <AddItem handleAddItem={this.handleAddItem}/>
            </section>
        )
    }
}

export default ItemList;