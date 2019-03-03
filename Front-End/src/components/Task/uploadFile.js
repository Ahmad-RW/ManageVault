import React, { Component } from 'react'
import FileUploader from 'react-firebase-file-uploader'
import firebase from "firebase";
import { connect } from 'react-redux'
import { fileUpload } from '../../store/actionCreators/taskActions'
import uuid from 'uuid'
class UploadFile extends Component {
    state = {
        isUploading: false,
        progress: 0
    };
    handleUploadStart = () => {
        this.setState({
            isUploading: true,
            progress: 0,
            fileURL: "",
            file : {},
            metaData : {}
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
                    <div class="progress-bar" role="progressbar" style={style}  aria-valuemin="0" aria-valuemax="100">{this.state.progress}</div>
                </div>
            )
        }
    }
    handleUploadSuccess = (filename) => {
        console.log(filename, "FIIILLEEE NAME")
        this.setState({ progress: 100, isUploading: false });
        var reference = firebase.storage().ref(this.props.projectInContext._id).child(filename)
        reference.getMetadata().then(metaData => {
            console.log(metaData)
            reference.getDownloadURL().then(url => {
                metaData = {
                    ...this.state.metaData,
                    updated : metaData.updated,
                    contentType : metaData.contentType
                }
                console.log(metaData)
                const payload = {
                    metaData,
                    url,
                    projectInContext: this.props.projectInContext,
                    task : this.props.task,
                    fbName : filename
                }
                this.props.fileUpload(payload)
            })
        })
    }
    handleChange = (e) =>{
        console.log(e.target.files[0])
        this.setState({
            file : e.target.files[0],
            metaData : {name : e.target.files[0].name, size : e.target.files[0].size, type : e.target.files[0].type}
        })
    }
    handleUpload = (e) =>{
    console.log(uuid())
    console.log(this.state.file)
    const tmpID = uuid()
       const uploadJob =  firebase.storage().ref(`${this.props.projectInContext._id}/${tmpID}`).put(this.state.file, this.state.metaData )
       uploadJob.on('state_changed', 
        (snapshot)=>{
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState({
                progress,
                isUploading:true
            })

        },
        (error)=>{
            this.handleUploadError(error)
        },
        ()=>{
            this.handleUploadSuccess(tmpID)
        })
    }
    handleUploadError = error =>{
        console.error(error)
    }
    render() {
        return (
            <div>
                {this.renderProgressBar()}
                <input type="file" onChange={this.handleChange} />
                <button type="submit" onClick={this.handleUpload}>Upload File</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile)