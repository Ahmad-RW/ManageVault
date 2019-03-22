import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileViewer from 'react-file-viewer'
import SideBar from '../layout/Sidebar';
import ProjectSubBar from '../layout/projectSubBar'
import DocumentCard from './DocumentCard';
import Axios from 'axios'
import {exportDocuments} from '../../store/actionCreators/storageActions'
class Storage extends Component {

    state = {
        userInfo: this.props.userInfo,
        project: this.props.project,
        googleConsentURL: "",
        documentsToExport :[]
    }

   
  
  
  
   
    render() {
        return (
            <div>

                <ProjectSubBar />
                <hr />
             
                <div className="container-fluid">
                    <SideBar />
                </div>
                <div className="container">
                    <DocumentCard />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        exportDocuments : (payload)=>{dispatch(exportDocuments(payload))}
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo : state.userInfo,
        projectInContext: state.projectInContext
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Storage)