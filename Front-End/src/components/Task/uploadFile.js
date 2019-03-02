import React, { Component } from 'react'
import FileUploader from 'react-firebase-file-uploader'
import firebase from "firebase";
import { connect } from 'react-redux'
import { fileUpload } from '../../store/actionCreators/taskActions'
class UploadFile extends Component {
    state = {
        isUploading: false,
        progress: 0
    };
    handleUploadStart = () => {
        this.setState({
            isUploading: true,
            progress: 0,
            fileURL: ""
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
                    <div class="progress-bar" role="progressbar" style={style} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{this.state.progress}</div>
                </div>
            )
        }
    }
    handleUploadSuccess = (filename) => {
        console.log(filename, "FIIILLEEE NAME")
        this.setState({ progress: 100, isUploading: false });
        var reference = firebase.storage().ref(this.props.projectInContext._id).child(filename)
        reference.getMetadata().then(metaData => {
            reference.getDownloadURL().then(url => {
                const payload = {
                    metaData,
                    url,
                    projectInContext: this.props.projectInContext,
                    //task
                }
                this.props.fileUpload(payload)
            })
        })
    }
    render() {
        return (
            <div>
                {this.renderProgressBar()}
                <FileUploader
                    storageRef={firebase.storage().ref(this.props.projectInContext._id)}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                />
            </div>
        )
    }
}

export const mapStateToProps = state => {
    return {
        projectInContext: state.projectInContext
    }
}

export const mapDispatchToProps = dispatch => {
    return {
        fileUpload: (payload) => dispatch(fileUpload(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile)