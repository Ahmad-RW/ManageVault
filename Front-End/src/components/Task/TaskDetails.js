import React, { Component } from 'react'
import { connect } from 'react-redux'
import { newComment, checkActivity } from '../../store/actionCreators/taskActions'
import { makeid, normalizeDate } from '../../helper'

class TaskDetails extends Component {
    state = {
        comment: ""
    }

    handleComment = (e) => {
        console.log(e.target.value)
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handelCommentSubmit = () => {
        const comment = {
            content: this.state.comment,
            author: this.props.userInfo.name,
            date: new Date()
        }
        console.log(comment)
        this.props.newComment(comment, this.props.task, this.props.projectInContext)

    }
    renderPredecessorList = () => {
        let tmp = ""
        this.props.task.dependencies.predecessor.forEach(element => {
            tmp = tmp.concat(" ", element, ",")
        })
        return tmp
    }
    renderSuccessorList = () => {
        let tmp = ""
        this.props.task.dependencies.successor.forEach(element => {
            tmp = tmp.concat(" ", element, ",")
        })
        return tmp
    }
    renderComments = () => {
        const commentsList = this.props.task.comments.map(comment => {
            return (<div class="container border" >
                <div>
                    <span>{comment.author}</span>
                    <p>
                        {comment.content}
                    </p>
                    <span>
                        {comment.date}
                    </span>
                </div>
            </div>)
        })
        return commentsList
    }
    handleActivityCheck = (e, activity) =>{
        console.log(e.target.checked)
        let payload
        if(!e.target.checked){
             payload = {
                task : this.props.task,
                activity,
                project : this.props.projectInContext,
                status : "UNCHECKED"
            }
        }
        else{
             payload = {
                task : this.props.task,
                activity,
                project : this.props.projectInContext,
                status : "CHECKED"
            }
        }
        this.props.checkActivity(payload)
    }
    renderActivities = () => {
        if(this.props.task.activities.length===0){
            return <span>No Activities Made</span>
        }
        const activities = this.props.task.activities.map(activity => {
            if (activity.status === "CHECKED") {
                return (
                    <li>
                        <strike>{activity.name}</strike>
                        <input type="checkbox" checked onClick={(e)=>{this.handleActivityCheck(e,activity)}} />
                    </li>

                )
            }
            else {
                return (
                    <li>{activity.name}
                    <input type="checkbox" onClick={(e)=>{this.handleActivityCheck(e, activity)}} />
                    </li>
                )
            }
        })
        return activities
    }
    render() {
        let text = makeid()
        console.log(this.props.task)
        var date = this.props.task.startDate.split("T")
        var time = date[1].split(":")[0] + ":" + date[1].split(":")[1]
        return (
            <div>
                <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target={"#" + text} >
                    Task Details
                </button>
                <div class="modal fade" id={text} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" id="exampleModalLabel">{this.props.task.name}</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body container">
                                <div className="row">
                                    <div className="col-6">
                                        <label>Start Date : {date[0]} {time} </label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <label>Duration: {this.props.task.duration} Days</label>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Description</h5>
                                        <p>{this.props.task.description}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-12">
                                        <h5>Dependencies</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <label>Predecessor Tasks :</label>
                                    </div>
                                    <div className="col">
                                        {this.renderPredecessorList()}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <label>Successor Tasks :</label>
                                    </div>
                                    <div className="col">
                                        {this.renderSuccessorList()}
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col">
                                        <h5>Task Sub-Activities</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <ol>
                                            {this.renderActivities()}
                                        </ol>
                                    </div>
                                </div>
                                <hr />

                                {this.renderComments()}

                                <div className="container">
                                    <div className="row">
                                        <div className="col-12">
                                            <textarea placeholder="write your comment here..." className="comment-textarea" id="comment" onChange={(e) => { this.handleComment(e) }}></textarea>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <button onClick={this.handelCommentSubmit} className="btn btn-primary btn-sm">Submit Comment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
        projectInContext: state.projectInContext
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        newComment: (comment, task, project) => dispatch(newComment(comment, task, project)),
        checkActivity : payload => dispatch(checkActivity(payload))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails)