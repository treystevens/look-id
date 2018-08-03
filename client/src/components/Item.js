import React, { Component } from 'react';   
import Stores from './Stores';
import CreateElem from './CreateElem';
import { getData } from '../util/serverFetch';
import InputField from './InputField';
import { connect } from 'react-redux';
import './Item.css';


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

            const serverResponse = getData(`/user/${urlUser}/${urlPostID}/edit`);

            serverResponse.then(response => response.json())
            .then((data) => {
                console.log(data, `the returned data`);
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
            this.props.addItemToParentState(this.state.items);
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

        if(this.state.items.length > 4){
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
        
        // Allow up to 3 stores
        if(updatedItem.stores.length > 2) return 1;
        
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
            <div className='item' key={`item${index}`}>
            
                <InputField label='Name:' type='text' onChange={this.handleInputChange(index, `name`)} value={item.name} addClass='form__field--stack' spacing='stack'/>
                
                <div className='item-container__category'>
                    <label className='form__label '>Category:
                        <select value={this.state.value} onChange={this.handleInputChange(index, `category`)}  className='item__category-select form__field--stack'>
                        <option disabled> -- select an option -- </option>
                            <option value='accesory'>Accesory</option>
                            <option value='blazer'>Blazer</option>
                            <option value='dress'>Dress</option>
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

                <InputField label='Color:' type='text' onChange={this.handleInputChange(index, `color`)} value={item.color} addClass='form__field--stack' spacing='stack' />
                
                
                    <InputField label='Price:' type='number' onChange={this.handleInputChange(index, `price`)} value={item.price} addClass='form__field--stack' spacing='stack' />
                    
                    <label className='form__label--thrifted'>Thrifted?
                        {item.thrifted &&
                            <input className='form__field-thrifted' type='checkbox' onChange={this.handleThriftedChange(index)} value={item.thrifted} checked />
                        }
                        {!item.thrifted &&
                            <input type='checkbox' onChange={this.handleThriftedChange(index)} value={item.thrifted} />
                        }


                        
                    </label>
                
                <div>
                    <label>Store:
                        <Stores index={index} handleAddStore={this.handleAddStore} stores={item.stores} handleStoreInputChange={this.handleStoreInputChange}  handleRemoveStore={this.handleRemoveStore}/>
                    </label>
                </div>

                <InputField label='Link:' type='text' onChange={this.handleInputChange(index, `link`)} value={item.link} addClass='form__field--stack' spacing='stack'/>  
                

                <button type='button' onClick={this.handleRemoveItem(index)} className='item__delete'>
                    <svg className='item__delete-svg' enableBackground="new 0 0 96 96" viewBox="0 0 96 96" height='30px' width='30px' xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="m96 14-14-14-34 34-34-34-14 14 34 34-34 34 14 14 34-34 34 34 14-14-34-34z"/></svg>

                </button>
            
                
            </div>
        )
    })


        return(
            <section className='items'>
                {fields}
                <CreateElem handleCreate={this.handleAddItem} text='Add Item' size='med'/>
            </section>
        )
    }
}

function mapStateToProps(state){
    return{
        username: state.username
    }
}

export default connect(mapStateToProps)(Item);







