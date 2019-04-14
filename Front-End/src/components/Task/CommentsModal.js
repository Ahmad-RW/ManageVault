import React, { Component } from 'react'
import { makeid } from '../../helper'
import { newComment } from '../../store/actionCreators/taskActions'
import {connect}from 'react-redux'
class CommentsModal extends Component {
    state = {
        comment: ""
    }

    renderComments = () => {
        var startDate,date,time
        const commentsList = this.props.task.comments.map(comment => {
            startDate = comment.date
            date = startDate.split("T")
            time = date[1].split(":")[0] + ":" + date[1].split(":")[1]

            return (<div class="container border" >
                <div>
                    <span>{comment.author}</span>
                    <p>
                        {comment.content}
                    </p>
                    <span>
                        {date[0]} {time}
                    </span>
                </div>
            </div>)
        })
        return commentsList
    }
    handleComment = (e) => {
       
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
        if(this.state.comment.length >160)
        {
            alert("comments have to be less than 160 characters")
            return
        }
        this.props.newComment(comment, this.props.task, this.props.projectInContext)

    }

    render(){
        var text = makeid()
        return(
            <div>
                <div className="tooltips">
                    <button title="Comments" type="button" class="close" data-toggle="modal" data-target={"#" + text} >
                        <i class="material-icons">comment</i>
                    </button>
                    <span className="tooltiptext">Comments</span>
                </div>
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
                                {this.renderComments()}

                                <div className="container">
                                    <div className="row">
                                        <div className="col-12">
                                            <textarea  placeholder="write your comment here..." className="comment-textarea" id="comment" onChange={(e) => { this.handleComment(e) }}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                            <div className="col-12">
                                <button onClick={this.handelCommentSubmit} className="btn btn-primary btn-sm">Submit Comment</button>
                            </div>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsModal)