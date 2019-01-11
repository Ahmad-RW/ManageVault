import React, {Component} from 'react'
import {connect } from 'react-redux'
class Home extends Component{
    constructor(props){
        super(props)
        console.log(props, 'home construct')
    }
    render(){
        return(
            <h>hi</h>
        )
    }
}

const mapStateToProps = (state, ownProps) =>{
    return{
        authenticated : state.isAuthenticated
    }
}

export default connect(mapStateToProps)(Home)
