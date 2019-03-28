import React, { Component } from 'react'

import { connect } from 'react-redux';
import { handleDBXImport } from '../../store/actionCreators/storageActions';

class DBXChooser extends Component {

    componentDidMount() {
        var options = {
            success: (files) => {
                this.onSuccess(files)
            },
            multiselect: true,

        }
        var button = window.Dropbox.createChooseButton(options)
        if(this.props.task === null){
            document.getElementById("storage-DBX-chooser").append(button)
            return
        }
        var eID = this.props.task._id + " DBXChooser" 
        document.getElementById(eID).append(button)
    }
    onSuccess = (files) => {
        const payload = {
            files,
            userInfo : this.props.userInfo,
            project : this.props.projectInContext,
            isInput : this.props.isInput,
            task : this.props.task
        }
        this.props.handleDBXImport(payload)
       
    }
    render() {
        return (
           <span></span>
        )
    }

}
const mapStateToProps = (state)=>{
    return{
        projectInContext: state.projectInContext,
        userInfo : state.userInfo
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        handleDBXImport : (payload)=>dispatch(handleDBXImport(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DBXChooser)