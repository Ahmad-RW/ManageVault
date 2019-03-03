import React ,{Component} from 'react' 
import {connect} from 'react-redux'
import FileViewer from 'react-file-viewer'

class Storage extends Component{
   
    render(){
       return(
           <h1>HI</h1>
       )
    }
}

const mapDispatchToProps = (dispatch)=> {
    return{

    }
}

const mapStateToProps = (state) =>{
    return{
        projectInContext : state.projectInContext
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Storage)