import React, { Component } from 'react';   
import Stores from './Stores';
import AddItem from './AddItem';
import { getData } from '../util/serverFetch';

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
                stores: [],
                link: ''
            }]
        };
    }

    componentDidMount(){
        if(this.props.editPost){
            
            const urlPostID = this.props.urlParams.match.params.postid;
            const urlUser = this.props.username;

            const serverResponse = getData(`/user/${urlUser}/${urlPostID}`);

            serverResponse.then(response => response.json())
            .then((data) => {

                if(data.post.items){
                    this.setState({
                        items: data.post.items.items,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }

    }

    // Function that will handle all of our input state
    handleInputChange = (index, propertyName) => (evt) => {

        // Get an index of which item we are changing and update the property
        const newItems = this.state.items.map((item, itemIndex) => {
            if( index !== itemIndex) return item;
            return { ...item, [propertyName]: evt.target.value };
        })

        // Lift state up to parent component 
        this.setState({ items: newItems}, () => {
            this.props.addItemToParentState(this.state.items)
        })
    };

    // Handle the Thrifted Checkbox state
    handleThriftedChange = (index) => (evt) => { 
        const newItems = this.state.items.map((item, itemIndex) => {
            if( index !== itemIndex) return item;
            return { ...item, thrifted: evt.target.checked };
        })

        this.setState({ items: newItems}, () => {
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
            stores: [],
            link: '' }]) 
    });
    }

    handleStoreInputChange = (value, storeIndex, itemIndex) => {

        // Copy this.state.items
        const updatedItem = {...this.state.items[itemIndex]}

        // Update the index store value
        updatedItem.stores[storeIndex] = value;

        // return the new updated item alongside the other items found in state
        const newItems = this.state.items.map((item, index) => {
            if( index !== itemIndex) return item;
            return updatedItem;
        })

        this.setState({
            items: newItems
        }, () => {
            this.props.addItemToParentState(this.state.items)
        })
    }

    // Remove Item
    handleRemoveItem = (index) => () => {

        this.setState({ 
            items: this.state.items.filter( (item, itemIndex) => index !== itemIndex) 
        }, () => {
            this.props.addItemToParentState(this.state.items)
        });
    };

    // Lifting state from Store Component and adding to this state
    handleAddStore = (index) => {

        const updatedItem = {...this.state.items[index]};
        
        const addingStore = updatedItem.stores.concat('')
        
        updatedItem.stores = addingStore;

        const newItems = this.state.items.map((item, itemIndex) => {
            if( index !== itemIndex) return item;
            return updatedItem;
        })

        this.setState({ items: newItems}, () => {
            this.props.addItemToParentState(this.state.items)
        })

    }

    handleRemoveStore = (itemIndex, storeIndex) => {
        const updatedItem  = {...this.state.items[itemIndex]}

        // eslint-disable-next-line
        const updatedStores = updatedItem.stores.filter((store, index) => {
            if(index !== storeIndex) return store
        })


        updatedItem.stores = updatedStores;

        const newItem = this.state.items.map((item, index) => {
            if(index !== itemIndex) return item
            return updatedItem;
        })

        this.setState({
            items: newItem
        }, () => {
            this.props.addItemToParentState(this.state.items)
        })

    }

    render(){

        const fields = this.state.items.map((item, index) => {

        return(
            <div style={{display: 'flex', flexFlow: 'row wrap', position: 'relative', width: '30%', marginTop: '40px'}} key={`item${index}`}>
                <div>
                    <label>Name:
                        <input type='text' placeholder={`Item #${index + 1} name`} value={item.name}
                        onChange={this.handleInputChange(index, `name`)} />
                    </label>
                </div>

                <div>
                    <label>Category:
                    <select value={this.state.value} onChange={this.handleInputChange(index, `category`)}>
                    <option disabled defaultValue> -- select an option -- </option>
                        <option value='accesory'>Accesory</option>
                        <option value='blazer'>Blazer</option>
                        <option value='jacket'>Jacket</option>
                        <option value='jeans'>Jeans</option>
                        <option value='pants'>Pants</option>
                        <option value='shirt'>Shirt</option>
                        <option value='shoes'>Shoes</option>
                        <option value='shorts'>Shorts</option>
                        <option value='socks'>Socks</option>
                        <option value='shoes'>Suit</option>
                        <option value='shoes'>Sweater</option>
                    </select>
                       
                    </label>
                </div>

                <div>
                    <label>Color:
                        <input type='text' placeholder={`Item #${index + 1} color`} 
                        onChange={this.handleInputChange(index, `color`)}/>
                    </label>
                </div>

                <div>
                    <label>Price:
                        <input type='text' placeholder={`Item #${index + 1} price`} 
                        onChange={this.handleInputChange(index, `price`)} />
                    </label>
                    <label>Thrifted:
                        <input type='checkbox' onClick={this.handleThriftedChange(index)} />
                    </label>
                </div>

                <div>
                    <label>Store:
                        <Stores index={index} handleAddStore={this.handleAddStore} stores={item.stores} handleStoreInputChange={this.handleStoreInputChange}  handleRemoveStore={this.handleRemoveStore}/>
                    </label>
                </div>

                <div>
                    <label>Online Link:
                        <input type='text' placeholder={`Item #${index + 1} online link`} 
                        onChange={this.handleInputChange(index, `link`)}  />
                    </label>
                </div>

                <button type='button' onClick={this.handleRemoveItem(index)}>X</button>
            
                
            </div>
                
        )
    })


        return(
            <section>
                {fields}
                <AddItem handleAddItem={this.handleAddItem} />
            </section>
        )
    }
}



export default Item;

/* jshint ignore:end */






