import React, { Component } from 'react';

class ItemSearch extends Component{
    
    render(){
        return(
            <div>
                <form>
                    <input type="text" name="query" />
                    <input type="text" name="queryprice" placeholder="$0.00"/>
                </form>
            </div>
        )
    }
}


export default ItemSearch;