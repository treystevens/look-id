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

    handleAddItem(){

        if(this.state.addItemCount === 6){
            return 1;
        }

        this.setState({
            addItemCount: this.state.addItemCount + 1
        });
    }

    handleDeleteItem(item){

        let check = this.state.deleteItem

        this.setState({
            addItemCount: this.state.addItemCount - 1,
            deleteItem: Object.assign(this.state.deleteItem, item)
            
        });
    }


    render(){

        const items = [];
        console.log(this.state.deleteItem);

        for (let i = 0; i < this.state.addItemCount; i += 1) {
            items.push(<Item key={i} itemNumber={i} deleteItem={this.handleDeleteItem}/>);
        };
        
        console.log(items)
        return(
            <section>
                    {items}
                    <AddItem handleAddItem={this.handleAddItem}/>
            </section>
        )
    }
}

export default ItemList;