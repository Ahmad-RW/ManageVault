import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAbsoluteValue } from '../../helper';
import Chart from './chart'
class MemberAnalysis extends Component {
    renderDurationPerformance = () => {     //Performance using submission duration (In days).
        let duration
        let overallDuration = 0
        let flooredHours
        let flooredDays
        let result
        this.props.projectInContext.tasks.map(task => {
            task.assignedMembers.map(member => {
                if(member.email === this.props.member.email){
                        let assignmentDate = new Date(member.startDate)
                        let submissionDate = new Date(task.endDate)
                        console.log(assignmentDate, "EH")
                        // let d1 = new Date('Sat Dec 16 2019 13:08:59 GMT+0300')
                        // let d2 = new Date('Sat Dec 17 2019 13:08:59 GMT+0300')
                        duration = (submissionDate - assignmentDate) / 3600000    //In hours
                        flooredHours = Math.floor(duration)
                    if(flooredHours < 24){
                        overallDuration = overallDuration + flooredHours
                        result = (
                            <p>{getAbsoluteValue(overallDuration)} hours.</p>
                        )
                    }else{
                        flooredHours = flooredHours / 24
                        flooredDays = Math.floor(flooredHours)
                        overallDuration = overallDuration + flooredDays
                        result = (
                            <p>{getAbsoluteValue(overallDuration)} days.</p>
                        )
                    }
                }
            })
        })
        if(isNaN(result)){
            let text = "None"
            return text
        }else{
          return result
        }
    }
    renderTasksPerformance = () => {        //Performance using submitted/overall tasks (As an integer).
        return(
            <p>{this.claculateSubmittedTasks()}/{this.calculateOverallTasks()}</p>
        )
    }
    calculateOverallTasks = () => {
        let overallTask = 0
        console.log(this.props.projectInContext)
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
    calculatePFCTasks = () => {
        let PFCTask = 0
        this.props.projectInContext.tasks.map(task => {
            task.assignedMembers.map(member => {
                if(member.email === this.props.member.email && task.status === "PENDING_FOR_CONFIRMATION"){
                    PFCTask++
                }
            })
        })
        return PFCTask
    }
    calculateToDoTasks = () => {
        let ToDoTask = 0
        this.props.projectInContext.tasks.map(task => {
            task.assignedMembers.map(member => {
                if(member.email === this.props.member.email && task.status === "TO_DO"){
                    ToDoTask++
                }
            })
        })
        return ToDoTask
    }
    chart = () => {
        let submittedTasks = this.claculateSubmittedTasks()
        let ToDoTasks = this.calculateToDoTasks()
        let PFCTasks = this.calculatePFCTasks()
        let chart = {
            chartData:{
                labels: ['To do', 'Pending for confirmation', 'Done'],
                datasets:[
                    {
                        label:'Tasks',
                        data:[ToDoTasks,PFCTasks,submittedTasks],
                        backgroundColor:[
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                        ]
                    },
    
                ],
            }
        }
        return chart
    }
    render(){
        return(
            <div>
                {this.renderTasksPerformance()}
                {this.renderDurationPerformance()}
                <Chart state={this.chart().chartData}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext,
        userInfo: state.userInfo,
    }
}
export default connect(mapStateToProps)(MemberAnalysis);
