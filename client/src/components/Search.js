import React, { Component } from 'react';
import ConfirmAction from './ConfirmAction';
import InputField from './InputField';

class Search extends Component{
    constructor(props){
        super(props);

        this.state = {
            query: '',
            thrifted: false,
            color: '',
            price: '',
            showConfirmation: false,
            actionSuccess: false,
            statusMessage: ''
        };

        
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
    }


    handleQueryChange(evt){
        this.setState({
            query: evt.target.value
        });
    } 
    handleColorChange(evt){
        this.setState({
            color: evt.target.value
        });
    }
    handlePriceChange(evt){
        const number = parseInt(evt.target.value, 10);
        this.setState({
            price: number
        });
    } 


    render(){
        
        return(
            <article className='search-container'>
                <form action='/search' className='search' autoComplete='off'>
                    <div className='form__search-container'>
                        <InputField type='text' name='query' placeholder='Search clothes, brands, etc.' onChange={this.handleQueryChange} search={true}required={true}/>
                            <button className='form__search-btn'>
                                <svg xmlns='http://www.w3.org/2000/svg' className='form__search-icon' width='20' height='30' viewBox='0 0 33 33'>
                                    <g fill='none' fillRule='evenodd' stroke='#979797' transform='translate(2 2)'>
                                    <path strokeLinecap='square' strokeWidth='3' d='M18.7541631,18.7373487 L28.5389438,28.5133567'/>
                                    <ellipse cx='10.6' cy='10.591' strokeWidth='3' rx='10.6' ry='10.591'/>
                                    </g>
                                </svg>
                            </button>
                    </div>
                    <div className='form__search-filters'>
                        <InputField type='text' name='color' placeholder='Color' onChange={this.handleColorChange} size='small'/>
                        <InputField type='number' name='price' placeholder='$' onChange={this.handlePriceChange} size='small'/>
                    </div>

                    {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.actionSuccess} statusMessage={this.state.statusMessage}/>
                    }
                </form>
            </article>
        )
    }
}


export default Search;