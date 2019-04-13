import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileViewer from 'react-file-viewer'
import SideBar from '../layout/Sidebar';
import ProjectSubBar from '../layout/projectSubBar'
import DocumentCard from './DocumentCard';
import Navbar from '../layout/Navbar'
import Axios from 'axios'
import UploadFile from './UploadFile'
import DBXChooser from './DBXChooser';
import { exportDocuments, handleDBXImport } from '../../store/actionCreators/storageActions'
class Storage extends Component {

    state = {
        userInfo: this.props.userInfo,
        project: this.props.project,
        consentURL: "",
        documentsToExport: [],

    }
    componentDidMount() {
        var options = {
            success: (files) => {
                this.onSuccess(files)
            },
            multiselect: true,

        }
        var button = window.Dropbox.createChooseButton(options)

        document.getElementById("storage-DBX-chooser").append(button)
    }
    onSuccess = (files) => {
        const payload = {
            files,
            userInfo: this.props.userInfo,
            project: this.props.projectInContext,
            isInput: false,

        }
        this.props.handleDBXImport(payload)

    }

    componentWillMount() {
        Axios.get("http://localhost:3333/dropbox/getURL").then((res) => {

            this.setState({
                consentURL: res.data
            })
        }).catch((err => {
            console.log(err)
        }))
    }
    addDocument = (doc) => {
        let newList = this.state.documentsToExport
        newList = [...newList, doc]
        this.setState({
            documentsToExport: newList
        })
    }
    renderFilesList = () => {
        const list = this.props.projectInContext.documents.map(doc => {
            if (doc.deleted || doc.hidden) {
                return
            }
            return (
                <li>
                    <span>{doc.name}</span>
                    <input value={doc._id} type="checkbox" onClick={() => { this.addDocument(doc) }} />
                </li>
            )
        })
        let tasks = this.props.projectInContext.tasks
        var allInputDocs = tasks.map(element => {
            if (element.deleted || element.file === "") {
                return

            }
            return (element.inputDocuments.map(inputDoc => {
                return (
                      <li>
                    <span>{inputDoc.name}</span>
                    <input value={inputDoc._id} type="checkbox" onClick={() => { this.addDocument(inputDoc) }} />
                </li>
                )
            })
            )
        })
        var allOutputDocs = tasks.map(element => {
            if (element.hidden || element.deleted) { return }
            return (element.outputDocuments.map(outDoc => {
                return (
                     <li>
                    <span>{outDoc.name}</span>
                    <input value={outDoc._id} type="checkbox" onClick={() => { this.addDocument(outDoc) }} />
                </li>
                )
            }))
        })
        const finalList=  list.concat(allInputDocs.concat(allOutputDocs))
        return finalList
    }
    exportDocuments = () => {
        const payload = {
            project: this.props.projectInContext,
            userInfo: this.props.userInfo,
            documents: this.state.documentsToExport
        }
        console.log(this.state)
        this.props.exportDocuments(payload)
        this.setState({
            documentsToExport: []
        })
    }
    renderExportButton = () => {
        //check for access token. if not render a button that will tak him to this.state.googleConsentURL
        if (!this.props.userInfo.token) {
            return (
                <a href={this.state.consentURL} className="btn btn-primary" title="sign in to dropbox to export/import documents">Export Files to Dropbox</a>
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
                <Navbar />
                <ProjectSubBar />
                <div className="row">
                <div className="col-8">
                        {this.renderExportButton()}
                        <div id="storage-DBX-chooser"> 
                            {/* DBX chooser will be inserted here. */}
                        </div>
                </div>
                    <div className="col-3">
                        <UploadFile />
                    </div>         
                <div className="container">
                    <DocumentCard />
                </div>
                </div>
                </div>

        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        exportDocuments: (payload) => { dispatch(exportDocuments(payload)) },
        handleDBXImport: (payload) => dispatch(handleDBXImport(payload))
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
        projectInContext: state.projectInContext
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Storage)