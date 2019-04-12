import React, { Component } from 'react'
import FileUploader from 'react-firebase-file-uploader'
import firebase from "firebase";
import { connect } from 'react-redux'
import { fileUpload, inputDocument } from '../../store/actionCreators/taskActions'
import uuid from 'uuid'
class UploadOutput extends Component {
    constructor(props) {

        super(props)
        this.state = {
            isUploading: false,
            progress: 0,
            fileURL: "",
            file: {},
            metaData: {},
            renderSuccessMessage: false,
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

            return (
                <div class="progress">
                    <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style={{ width: 100 + '%' }} aria-valuemin="0" aria-valuemax="100">{this.state.progress}</div>
                </div>
            )
        }
    }
    handleSuccess = (filename) => {

        this.setState({ progress: 100, isUploading: false });
        var reference = firebase.storage().ref(this.props.projectInContext._id).child(filename)
        reference.getMetadata().then(metaData => {
            reference.getDownloadURL().then(url => {

                metaData = {
                    ...this.state.metaData,//name , type , size 
                    updated: metaData.updated,// these are from firebase. supplemented by our meta data to form name, type, size , last modified and type/content type
                    contentType: metaData.contentType
                }
               
                const payload = {
                    metaData,
                    url,
                    projectInContext: this.props.projectInContext,
                    task: this.props.task,
                    storageReference: filename,
                    documentName: this.props.documentName,
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
                <h4>Upload Complete</h4>

            )
        }
    }
    handleOutputUpload = (e) => {
     
        this.setState({
            file: e.target.files[0],
            metaData: { fileName: e.target.files[0].name, size: e.target.files[0].size, type: e.target.files[0].type }
        })
        this.uploadFileToStorage(e.target.files[0])
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
                this.handleUploadError(error)
            },
            () => {
                this.handleSuccess(tmpID)
            })
    }
    handleUploadError = error => {
        console.error(error)
    }
    renderUploadCloud = () => {
        return (
            <label for={this.props.task._id.concat("-output")} className="btn">
                <i class="material-icons">cloud_upload</i>
            </label>
        )
    }
    render() {
      
        return (
            <div>
                {this.renderProgressBar()}
                {this.renderUploadCloud()}

                {/* <input type="text" onChange={this.handleDocumentName} id="documentName" /> */}
                <input type="file" id={this.props.task._id.concat("-output")} onChange={this.handleOutputUpload} />
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
        
        fileUpload: (payload) => dispatch(fileUpload(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadOutput)