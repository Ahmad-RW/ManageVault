import React, { Component } from 'react'
import firebase from "firebase";
import { connect } from 'react-redux'
import { storageUpload } from '../../store/actionCreators/storageActions'
import uuid from 'uuid'

class UploadFile extends Component {
    state = {
        file: {},
        metaData: {},
        isUploading:false,
        progress:0,
        documentName:"",
        renderSuccessMessage: false,
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
    renderUploadCloud = () => {
        return (
            <label for="file-upload" className="btn">
                <i class="material-icons md-light">cloud_upload</i>
            </label>
        )
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
                    const payload = {
                        metaData,
                        url,
                        projectInContext: this.props.projectInContext,
                        task: this.props.task,
                        storageReference: filename,
                        documentName: this.state.documentName
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
    

    render() {
        return (
            <div>
                {this.renderUploadCloud()}
                <input type="text" onChange={this.handleDocumentName} id="documentName" className="storage-upload-text-field" />
                <input type="file" id="file-upload" onChange={this.handleFileUpload} />

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
        fileUpload: (payload) => dispatch(storageUpload(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile)