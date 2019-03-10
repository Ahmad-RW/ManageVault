import React, { Component } from 'react'
import FileUploader from 'react-firebase-file-uploader'
import firebase from "firebase";
import { connect } from 'react-redux'
import { fileUpload, inputDocument } from '../../store/actionCreators/taskActions'
import uuid from 'uuid'
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
            documentName: ""
        };
    }

    handleUploadStart = () => {
        this.setState({
            isUploading: true,
        })
    }
    handleDocumentName = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleProgress = (progress) => {
        this.setState({
            progress
        })
    }
    renderProgressBar = () => {
        if (this.state.isUploading) {
            const style = {
                width: "100%;"
            }
            return (
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style={style} aria-valuemin="0" aria-valuemax="100">{this.state.progress}</div>
                </div>
            )
        }
    }
    handleUploadSuccess = (filename) => {
        console.log(this.state)
        console.log(filename, "FIIILLEEE NAME")
        this.setState({ progress: 100, isUploading: false });
        var reference = firebase.storage().ref(this.props.projectInContext._id).child(filename)
        reference.getMetadata().then(metaData => {
            reference.getDownloadURL().then(url => {
                metaData = {
                    ...this.state.metaData,
                    updated: metaData.updated,
                    contentType: metaData.contentType
                }
                   const  payload = {
                        metaData,
                        url,
                        projectInContext: this.props.projectInContext,
                        task: this.props.task,
                        storageReference: filename,
                        documentName: this.state.documentName,
                        isInput: this.props.isInput
                    }
                
               
                console.log(payload)
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
                <h1>Upload Complete</h1>

            )
        }
    }
    handleFileUpload = (e) => {
        console.log(e.target.files[0])
        this.setState({
            file: e.target.files[0],
            metaData: { fileName: e.target.files[0].name, size: e.target.files[0].size, type: e.target.files[0].type }
        })
        this.handleUpload(e.target.files[0])
    }
    handleUpload = (file) => {
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
                this.handleUploadError(error)
            },
            () => {
                this.handleUploadSuccess(tmpID)
            })
    }
    handleUploadError = error => {
        console.error(error)
    }
    renderUploadCloud = () => {
        if (this.props.dark) {
            return (
                <label for="file-upload" className="btn">
                    <i class="material-icons md-light">cloud_upload</i>
                </label>
            )
        }
        else {
            return (
                <label for="file-upload" className="btn">
                    <i class="material-icons">cloud_upload</i>
                </label>
            )
        }
    }
    renderTextField = () => {
        if (this.props.isInput) {
            return (
                <input type="text" onChange={this.handleDocumentName} id="documentName" />
            )
        }
    }
    render() {
        return (
            <div>
                {this.renderProgressBar()}
                {this.renderUploadCloud()}
                {this.renderTextField()}
                {/* <input type="text" onChange={this.handleDocumentName} id="documentName" /> */}
                <input type="file" id="file-upload" onChange={this.handleFileUpload} />
                {this.renderSuccessMessage()}
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