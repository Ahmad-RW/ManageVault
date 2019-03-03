import React, { Component } from 'react'
import { connect } from 'react-redux'
import FileViewer from 'react-file-viewer'
import SideBar from '../layout/Sidebar';
import ProjectSubBar from '../layout/projectSubBar'
class Storage extends Component {

    render() {
        return (
            <div>
                <ProjectSubBar />
                <hr />
               <SideBar />
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