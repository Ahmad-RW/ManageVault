import React, { Component } from 'react';
import { connect } from 'react-redux'; 

class MemberAnalysis extends Component {
    renderDurationPerformance = () => {     //Performance using submission duration (In days).
        let duration = (this.props.endDate) - (this.props.startDate)
        console.log(duration,"DURATION")
        return (
            <p>{duration}</p>
        )
    }
    renderTasksPerformance = () => {        //Performance using submitted/overall tasks (As an integer).
        return(
            <p>{this.claculateSubmittedTasks()}/{this.calculateOverallTasks()}</p>
        )
    }
    calculateOverallTasks = () => {
        let overallTask = 0
        this.props.projectInContext.tasks.map(task => {
            task.assignedMembers.map(member => {
                if(member.email === this.props.member.email){
                    overallTask++
                }
            })
        })
        return overallTask
    }
    claculateSubmittedTasks = () => {
        let submittedTask = 0
        this.props.projectInContext.tasks.map(task => {
            task.assignedMembers.map(member => {
                if(member.email === this.props.member.email && task.status === "SUBMITTED"){
                    submittedTask++
                }
            })
        })
        return submittedTask
    }
    
    getAbsoluteValue = (x) => {     //Helper
        if(x < 0)
            return x*-1;
        return x;
    }
    render(){
        return(
            <div>
                {this.renderTasksPerformance()}
                {this.renderDurationPerformance()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext,
        userInfo: state.userInfo,
        startDate: state.startDate,
        endDate: state.endDate
    }
}
export default connect(mapStateToProps)(MemberAnalysis);