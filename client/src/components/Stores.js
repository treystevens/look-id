import React, { Component } from 'react';


/* jshint ignore:start */

class Stores extends Component{
    constructor(props){
        super(props);

        this.state = {
                stores: [{
                    store: ''
                }]
                
        };
    }

    // Handle store input change and pass new input change to parent component
    handleInputChange = (index, propertyName) => (evt) => {
        const newStores = this.state.stores.map((store, storeIndex) => {
            if( index !== storeIndex) return store;
            return { ...store, [propertyName]: evt.target.value };
        })

        this.setState({ stores: newStores}, () => {
            this.props.handleStore(newStores, this.props.index);
        })
    };

    // Remove Store from state
    handleRemoveStore = (index) => () => {
        this.setState({ stores: this.state.stores.filter((store, storeIndex) => index !== storeIndex) });
    };

    // Adding store to our state
    handleAddStore = () => {
        this.setState(
            { 
                stores: this.state.stores.concat([{ 
                    store: '' 
                }]) 
            }, () => {
                console.dir(this.state)
            });
    }

    


    render(){
        return(
            <div>
                {this.state.stores.map((store, index) => (
                    <div>
                        <input type="text" placeholder={`Item #${index + 1} store location`} value={store.store}
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




