import React, { Component } from 'react'
import firebase from "firebase";
import { connect } from 'react-redux'
import { fileUpload, inputDocument } from '../../store/actionCreators/taskActions'
import uuid from 'uuid'
import Spinner from '../../helper_Components/Spinner'
class UploadFile extends Component {
    constructor(props) {
       
        super(props)
        this.state = {
            isUploading: false,
            progress: 0,
            fileURL: "",
            file: {},
            metaData: {},
            renderSuccessMessage: false,
            documentName: "",
            errorMSG: "",
            startSpinner: false
        };
    }

    handleUploadStart = () => {
        this.setState({...this.state,
            isUploading: true,
        })
    }
    handleDocumentNameChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleProgress = (progress) => {
        this.setState({
            progress
        })
    }
    renderProgressBar = () => {     //PROBLEM: Progress is Zero, that causes a problem in the progress bar. -> Solved -D7M-
        if (this.state.isUploading) {
            return (
                <div className="progress">
                    <div className="progress-bar bg-success progress-bar-striped" role="progressbar" aria-valuenow='50' aria-valuemin='0' aria-valuemax="100" style={{ width: this.state.progress + '%' }}>{/*this.state.progress*/}</div>
                </div>
            )
        }
    }
    handleSuccess = (filename) => {
        this.setState({ progress: 100, isUploading: false,startSpinner:false });
        var reference = firebase.storage().ref(this.props.projectInContext._id).child(filename)
        reference.getMetadata().then(metaData => {
            reference.getDownloadURL().then(url => {
                metaData = {
                    ...this.state.metaData,
                    updated: metaData.updated,
                    contentType: metaData.contentType
                }
                const payload = {
                    metaData,
                    url,
                    projectInContext: this.props.projectInContext,
                    task: this.props.task,
                    storageReference: filename,
                    documentName: this.state.documentName,
                    isInput: this.props.isInput
                }


                
                this.props.fileUpload(payload)
                this.setState({
                    renderSuccessMessage: true
                })
                setTimeout(() => { this.setState({ renderSuccessMessage: false }) }, 1000)
            })
        })
    }
    renderSuccessMessage = () => {
        if (this.state.renderSuccessMessage) {
            return (
                <p>Upload Complete</p>
            )
        }
    }
    isLogicalNameDuplicate = (documentName) => {
        
        let result = false
        this.props.projectInContext.documents.forEach(doc => {
            if (doc.name === documentName) {
                result = true
            }
        })
        return result
    }

    handleFileUpload = (e) => {
        this.setState({
            startSpinner:true
        })
        if (this.isLogicalNameDuplicate(this.state.documentName)) {
            this.renderDuplicationMessage()
            return
        }
        this.uploadFileToStorage(this.state.file)
    }

    renderDuplicationMessage = () => {
       let  error = <div className="alert alert-danger" role="alert">
            this document name already exists
                <button type="button" className="close" aria-label="Close" onClick={this.closeAlert}>
                <i className="material-icons ">highlight_off</i>
            </button>
        </div>
        this.setState({
            errorMSG: error,
            startSpinner:false
        })
    }
    closeAlert = () => {
        this.setState({
            errorMSG: <div></div>
        })
    }
    uploadFileToStorage = (file) => {
        const tmpID = uuid()
        const uploadJob = firebase.storage().ref(`${this.props.projectInContext._id}/${tmpID}`).put(file, this.state.metaData)
        uploadJob.on('state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({
                    progress,
                    isUploading: true
                })

            },
            (error) => {
                this.handleError(error)
            },
            () => {
                this.handleSuccess(tmpID)
            })
    }
    handleError = error => {
        console.error(error)
    }
    renderUploadCloud = () => {

        return (
            <div>
            {/* <label>{this.state.file.name} </label> */}
            <label for={this.props.task._id} className="btn">
                <i class="material-icons">cloud_upload</i>
            </label>
        </div>
        )

    }
    renderTextField = () => {
        return (
            <div>
                {this.state.errorMSG}
                <input type="text" onChange={this.handleDocumentNameChange} id="documentName" />
            </div>
        )

    }
    setFile = (e) => {
        this.setState({
            file: e.target.files[0],
            metaData: { fileName: e.target.files[0].name, size: e.target.files[0].size, type: e.target.files[0].type }
        })
    }
    render() {
        console.log(this.state.startSpinner,"spinner")
        return (
            <div>
                {this.renderProgressBar()}
                {this.renderUploadCloud()}
                {this.renderTextField()}
                <input type="file" id={this.props.task._id} onChange={this.setFile} />
                <button className="btn btn-primary" onClick={this.handleFileUpload}>Submit</button>
                {this.renderSuccessMessage()}
                <Spinner startSpinner={this.state.startSpinner} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        projectInContext: state.projectInContext
    }
}

const mapDispatchToProps = dispatch => {
    return {
        uploadInput: (payload) => dispatch(inputDocument(payload)),
        fileUpload: (payload) => dispatch(fileUpload(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile)