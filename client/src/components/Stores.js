import React, { Component } from 'react';
import InputField from './InputField';
import Button from './Button';


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
                    <div className='store' key={`item${this.props.index}-store${index}`}> 
                        <InputField type='text' onChange={this.handleInputChange(index)} value={store} spacing='stack' addClass='form__field--mb'/>    
                        
                        <svg onClick={this.handleRemoveStore(index)} className='store__delete' enableBackground="new 0 0 96 96" viewBox="0 0 96 96" height='20px' width='20px' xmlns="http://www.w3.org/2000/svg"><path d="m96 14-14-14-34 34-34-34-14 14 34 34-34 34 14 14 34-34 34 34 14-14-34-34z"/></svg>
                    </div>
                )
            })
        }
    
        return(
            <div className='item-container__stores'>
                <div className='item__stores'>
                    {stores}
                </div>
                <Button dummy={true} onClick={this.handleAddStore} addClass='btn--initial btn--stack' size='small' text='Add Store'/>
            </div>
        )
    }
}

export default Stores;






