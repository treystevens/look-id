import React, { Component } from 'react';
import ConfirmAction from './ConfirmAction';

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

        this.submitHandler = this.submitHandler.bind(this);
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
        this.setState({
            price: evt.target.value
        });
    } 


    submitHandler(evt){
        evt.preventDefault();

        const { query, price, thrifted } = this.state;

        // If the fields are empty
        if(!query && !price && !thrifted){
            // Fields are empty

            this.setState({
                showConfirmation: true,
                statusMessage: 'Please fill out a field'
            });
            return 1;
        }

        // Price is not a number
        if(isNaN(price)){

            this.setState({
                showConfirmation: true,
                statusMessage: 'Enter a number for the price'
            });
            return 1;
        }

        this.props.handleSearch(this.state);
    }

    render(){
        
        return(
            <article>
                <form action='/search'>
                    <input type='text' name='query' onChange={this.handleQueryChange}/>
                    <input type='text' name='color' placeholder='red, navy' onChange={this.handleColorChange}/>
                    <input type='text' name='price' placeholder='$0.00' onChange={this.handlePriceChange}/>
                    <button>Search</button>

                    {this.state.showConfirmation &&
                        <ConfirmAction actionSuccess={this.state.confirmAction} statusMessage={this.state.statusMessage}/>
                    }
                </form>
            </article>
        )
    }
}


export default Search;