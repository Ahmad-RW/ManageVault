import React, { Component } from 'react';
import { connect } from 'react-redux'; 
import Chart from './chart'
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
    getAbsoluteValue = (x) => {     //Helper
        if(x < 0)
            return x*-1;
        return x;
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
        startDate: state.startDate,
        endDate: state.endDate
    }
}
export default connect(mapStateToProps)(MemberAnalysis);
