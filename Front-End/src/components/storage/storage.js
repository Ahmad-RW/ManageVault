import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileViewer from 'react-file-viewer'
import SideBar from '../layout/Sidebar';
import ProjectSubBar from '../layout/projectSubBar'
import DocumentCard from './DocumentCard';
import Axios from 'axios';
import DBXChooser from './DBXChooser';
import {exportDocuments} from '../../store/actionCreators/storageActions'
class Storage extends Component {

    state = {
        userInfo: this.props.userInfo,
        project: this.props.project,
        consentURL: "",
        documentsToExport :[]
    }

    componentWillMount(){
        Axios.get("http://localhost:3333/dropbox/getURL").then((res)=>{
           
            this.setState({
                consentURL : res.data
            })
        }).catch((err=>{
            console.log(err)
        }))
    }
    addDocument = (doc) =>{
        let newList = this.state.documentsToExport
        newList = [...newList, doc]
        this.setState({
            documentsToExport : newList
        })
    }
    renderFilesList = () =>{
        const list = this.props.projectInContext.documents.map(doc=>{
            return(
                <li>
                    <span>{doc.name}</span>
                    <input value={doc._id} type="checkbox" onClick={()=>{this.addDocument(doc)}} />
                </li>
            )
        })
        return list
    }
    exportDocuments = () =>{
        const payload = {
            project : this.props.projectInContext,
            userInfo : this.props.userInfo,
            documents : this.state.documentsToExport
        }
        console.log(this.state)
        this.props.exportDocuments(payload)
    }
    renderExportButton = () => {
        //check for access token. if not render a button that will tak him to this.state.googleConsentURL
        if(!this.props.userInfo.token){
            return(
                <a href={this.state.consentURL} className="">Export Documents</a>
            )
        }
        return (
            <div>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exportModal">
                    Export Documents
                </button>
                <div class="modal" tabindex="-1" id="exportModal" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Modal title</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                            <ul>
                                {this.renderFilesList()}
                            </ul>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onClick={this.exportDocuments} data-dismiss="modal">Export</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div>

                <ProjectSubBar />
                <hr />
                {this.renderExportButton()}
                <DBXChooser />
                <div id="container">

                </div>
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