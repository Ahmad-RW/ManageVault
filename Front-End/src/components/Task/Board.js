import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from './DatePicker'
import CreateTask from './CreateTask'
import ProjectSubBar from '../layout/projectSubBar';
class Board extends Component {
    constructor(props){
        super(props)
      this.state = {
          project : this.props.location.state.project
      }
    }
    render() {
        
        
            console.log(this.props.location.state.project)
    
            var { tasks } = this.state.project//lvnejfbnvofebvfenbv
            if (typeof tasks === "undefined") {
                this.props.history.push('/')
            }
            const taskList = tasks.length ? (
                tasks.map(task => {
                    return (
                        <h4>{task.name}</h4>
                    )
                })
            ) : (
                    <h4>There is no tasks  yet</h4>
                )
        
        return (
            <div>
            <ProjectSubBar />
                {taskList}
                {console.log(this.state.project,"هذا ايش؟")}
                <CreateTask project={this.state.project}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.projectInContext,

    }
}
export default connect(mapStateToProps)(Board)