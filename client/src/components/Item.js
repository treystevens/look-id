import React, { Component } from 'react';   
import Stores from './Stores';
import AddItem from './AddItem';

/* jshint ignore:start */

class Item extends Component{
    constructor(props){
        super(props);

        this.state = {
            items: [{
                name: '',
                category: '',
                color: '',
                price: '',
                thrifted: false,
                stores: [{
                    store: ''
                }],
                link: ''
            }]
        };


    }

    // Function that will handle all of our input state
    handleInputChange = (index, propertyName) => (evt) => {
        const newItems = this.state.items.map((item, itemIndex) => {
            if( index !== itemIndex) return item;
            return { ...item, [propertyName]: evt.target.value };
        })

        this.setState({ items: newItems}, () => {
            this.props.addItemToParentState(this.state.items)
        })
    };

    // Handle the Thrifted Checkbox state
    handleThriftedChange = (index) => (evt) => { 
        console.log(evt.target.checked);
        const newItems = this.state.items.map((item, itemIndex) => {
            if( index !== itemIndex) return item;
            return { ...item, thrifted: evt.target.checked };
        })

        this.setState({ items: newItems}, () => {
            console.log(this.state.items)

            this.props.addItemToParentState(this.state.items)
        })
    }   
    
    // Adding new item
    handleAddItem = () => {

        if(this.state.items.length > 5){
            return 1;
        }

        this.setState({ items: this.state.items.concat([{ 
            name: '',
            category: '',
            color: '',
            price: '',
            thrifted: false,
            stores: [{
            store: ''
                        }],
            link: '' }]) 
    });
    }


    // Remove Item
    handleRemoveItem = (index) => () => {
        this.setState({ 
            items: this.state.items.filter( (item, itemIndex) => index !== itemIndex) 
        });
    };

    // Lifting state from Store Component and adding to this state
    handleAddStoreToState = (storeState, index) => {
        const newItems = this.state.items.map((item, itemIndex) => {
            if( index !== itemIndex) return item;
            return { ...item, stores: storeState };
        })

        this.setState({ items: newItems}, () => {
            console.log(this.state.items)
        })
    }


    render(){
        return(
                
            <section>
                {this.state.items.map((item, index) => (
                    <div style={{display: 'flex', flexFlow: 'row wrap', position: 'relative', width: '30%', marginTop: '40px'}}>
                        <div>
                            <label>Name:
                                <input type="text" placeholder={`Item #${index + 1} name`} value={item.name}
                                onChange={this.handleInputChange(index, `name`)} />
                            </label>
                        </div>

                        <div>
                            <label>Category:
                                <input type="text" placeholder={`Item #${index + 1} category`} value={item.category}
                                onChange={this.handleInputChange(index, `category`)}/>
                            </label>
                        </div>

                        <div>
                            <label>Color:
                                <input type="text" placeholder={`Item #${index + 1} color`} value={item.color}
                                onChange={this.handleInputChange(index, `color`)}/>
                            </label>
                        </div>

                        <div>
                            <label>Price:
                                <input type="text" placeholder={`Item #${index + 1} price`} value={item.price}
                                onChange={this.handleInputChange(index, `price`)} />
                            </label>
                            <label>Thrifted:
                                <input type="checkbox" onClick={this.handleThriftedChange(index)} />
                            </label>
                        </div>

                        <div>
                            <label>Store:
                                <Stores index={index} handleStore={this.handleAddStoreToState}/>
                            
                                {/* <button type="button" onClick={this.handleAddStore} className="small">Add Store</button> */}
                            </label>
                        </div>

                        <div>
                            <label>Online Link:
                                <input type="text" placeholder={`Item #${index + 1} online link`} value={item.link}
                                onChange={this.handleInputChange(index, `link`)}  />
                            </label>
                        </div>

                        <button type="button" onClick={this.handleRemoveItem(index)}>X</button>
                    
                        
                    </div>
                        
                ))}

                <AddItem handleAddItem={this.handleAddItem} />
            </section>
        )
    }
}



export default Item;

/* jshint ignore:end */






