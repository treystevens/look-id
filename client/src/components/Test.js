import React, { Component } from 'react';

class Test extends Component{
    
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


export default Test;