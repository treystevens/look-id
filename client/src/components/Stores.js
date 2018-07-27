import React, { Component } from 'react';


class Stores extends Component{
 
    // Handle store input change and pass new input change to parent component
    handleInputChange = (index) => (evt) => {

        const targetValue = evt.target.value;
        const itemIndex = this.props.index;

        this.props.handleStoreInputChange(targetValue, index, itemIndex);        
    }

    // Remove Store from state
    handleRemoveStore = (storeIndex) => () => {
        
        const index = this.props.index;
        this.props.handleRemoveStore(index, storeIndex);

    };


    // Adding a store - to Item Component
    handleAddStore = () => {
        const itemIndex = this.props.index;
        this.props.handleAddStore(itemIndex);
    };


    render(){

        let stores; 
        if(this.props.stores){
            stores = this.props.stores.map((store, index) => {
                return (
                    <div key={`item${this.props.index}-store${index}`}>
                        <input type='text' placeholder={`Item #${index + 1} store location`}
                            onChange={this.handleInputChange(index)} value={store}/> 
                            
                        <button type='button' onClick={this.handleRemoveStore(index)}>x</button>
                    </div>
                )
            })
        }
    
        return(
            <div>
                {stores}
                <button type='button' onClick={this.handleAddStore} className='small'>Add Store</button>
            </div>
        )
    }
}

export default Stores;






