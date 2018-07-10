import React, { Component } from 'react';


/* jshint ignore:start */

class Stores extends Component{
    constructor(props){
        super(props);

        this.state = {
                stores: []
                
        };
    }

    // Handle store input change and pass new input change to parent component
    handleInputChange = (index, propertyName) => (evt) => {
        this.state.stores.map((store, storeIndex) => {

            if(index === storeIndex){
                const newStores = Array.from(this.state.stores);
                newStores[storeIndex] = evt.target.value;
                
                this.setState({ stores: newStores}, () => {
                    console.log(this.state.stores)
                    this.props.handleStore(newStores, this.props.index);
                })
            }

            
        })
        
    };

    // Remove Store from state
    handleRemoveStore = (index) => () => {
        this.setState({ stores: this.state.stores.filter((store, storeIndex) => index !== storeIndex) }, () => {
            console.log(this.state.stores)
            this.props.handleStore(this.state.stores, this.props.index);
        });
    };

    // Adding store to our state
    handleAddStore = () => {
        this.setState(
            {  stores: this.state.stores.concat('') }, () => {
            });
    }

    
    // Current issues with this.
    // If you add stores normally with deleting items it works fine.
    // If you add stores and delete a store and dont type anything into the store, the database gets the store (the value will show the store of the one that was deleted, not the ones you need)
    // If you add stores and delete one and then change the deleted one it will change the value inside the state
    // Deleting an item also causes problem, it seems that the item is not really deleting and that the stores are still placed into the server. for instance i had three items, deleted the second, but the info from the second item was still sent to the server


    render(){
        return(
            <div>
                {this.state.stores.map((store, index) => (
                    <div>
                        <input type="text" placeholder={`Item #${index + 1} store location`} value={this.state.store}
                            onChange={this.handleInputChange(index, `store`)} /> 
                        <button type="button" onClick={this.handleRemoveStore(index)}>x</button>
                    </div>
                ))}
                <button type="button" onClick={this.handleAddStore} className="small">Add Store</button>
                </div>
        )
    }
}



export default Stores;



/* jshint ignore:end */




