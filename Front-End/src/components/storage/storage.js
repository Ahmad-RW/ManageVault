import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileViewer from 'react-file-viewer'
import SideBar from '../layout/Sidebar';
import ProjectSubBar from '../layout/projectSubBar'
import DocumentCard from './DocumentCard';
class Storage extends Component {

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

    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Storage)