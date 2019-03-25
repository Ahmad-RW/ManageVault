import React, { Component } from 'react'

class Spinner extends Component {
    renderspinner = () => {
        if(this.props.startSpinner===true){
            return(
                <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            )
        }
    }
    render(){
        return (
            <div>
                {this.renderspinner()}
            </div>
        )
    }
}

export default Spinner