import React, { Component } from 'react';


/* jshint ignore:start */

class ItemQuery extends Component{
    
    render(){
        return(
            <div>
                <form autoComplete="off">
                    <input type="text" name="query"/>
                    <input type="text" name="queryprice" placeholder="$0.00"/>
                </form>
            </div>
        )
    }
}


export default ItemQuery;

// Code here will be ignored by JSHint.
/* jshint ignore:end */