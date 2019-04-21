import axios from 'axios'

export const createProjectAction = (project, userInfo) => {
    return (dispatch, getState) => {
        axios.post('/project/newproject', { project, userInfo }).then((res) => {
            dispatch({ type: "CREATE_PROJECT", project: res.data })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}


export const fetchUserProjects = (userEmail) => {
    return (dispatch, getState) => {
        axios.get('/project/getUserProjects?userEmail=' + userEmail).then((res) => {
            console.log(res.data, "in fetch projects action")
            dispatch({ type: "SET_USER_PROJECTS", projects: res.data })
        }).catch((exception) => {
            dispatch({type:"REMOVE_AUTH"})
        })
    }
}

export const requestDeleteAction = (project) => {
    return (dispatch) => {
        console.log(project)
        axios.post('/project/deleteproject', { project }).then((res) => {
            dispatch({ type: "REQUEST_DELETE", project })
            console.log(res)
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const requestToDeleteProject = (project, userInfo) => {
    return (dispatch) => {
        console.log(project, userInfo)
        console.log("In request to delete project")
        const payload = {
            project,
            userInfo
        }
        axios.post('/project/requestDeleteProject', { project, userInfo }).then((res) => {
            dispatch({ type: "REQUEST_TO_DELETE_PROJECT", payload })
            console.log(res)
        }).catch((exception) => {
            console.log(exception)
        })
    }
}





export const leaveProject = (project, userInfo) => {
    return (dispatch, getState) => {
        console.log('in action')
        const payload = { project, userInfo }
        axios.post('/project/leaveProject', { project, userInfo }).then((res) => {
            dispatch({ type: "LEAVE_PROJECT", payload })
            console.log(res)
        })
    }
}

export const removeTeamMember = (project, member) => {
    console.log("remove action here")
    return (dispatch, getState) => {
        const payload = { project, member }
        axios.post('/project/removeTeamMember', { project, member }).then((res) => {
            dispatch({ type: "REMOVE_TEAM_MEMBER", payload })
            console.log(res)
        })
    }
}

export const handleInvite = (project, userInfo, notification) => {
    return (dispatch) => {
        const payload = { project, userInfo, notification }
        axios.post('/project/handleInvite', { project, userInfo, notification }).then((res) => {
            console.log(res)
            dispatch({ type: "ACCEPT_INVITE", payload })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const handleNotificationDelete = (projectId, userInfo, notification) => {
    console.log(userInfo)
    return (dispatch) => {
        const payload = { projectId, userInfo, notification }
        axios.post('/project/handleNotificationDelete', { projectId, userInfo, notification }).then((res) => {
            dispatch({ type: "DELETE_NOTIFICATION", payload })
            console.log(res)
        }).catch((exception) => {
            console.log(exception)
        })
    }
}




export const handleVoting = (payload) => {
    console.log(payload, "IN ACTION")
    return (dispatch) => {
        axios.post("/project/handleVoting", { payload }).then((res) => {
            console.log(res)
            payload = { ...payload, res }
            //dispatch({ type: "REQUEST_TO_DELETE_PROJECT", payload})
            console.log("DISPATCHED")
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const newRole = (payload) => {
    return (dispatch) => {

        axios.post("/project/newRole", { payload }).then((res) => {
            console.log(res)
            payload = { ...payload, res }
            dispatch({ type: "NEW_ROLE", payload })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const setAuthority = (payload) => {
    return (dispatch) => {
        console.log(payload)
        axios.post('/project/setAuthority', { payload }).then((res) => {
            console.log(res)
            payload = { ...payload, res }
            dispatch({ type: "SET_AUTHORITY", payload })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const revokeAuthorities = (payload) => {
    return (dispatch) => {
        axios.post('/project/revokeAuthorities', { payload }).then((res) => {
            console.log(res)
            payload = { ...payload, res }
            dispatch({ type: "SET_AUTHORITY", payload })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const assignNewTeamLeader = (memberEmail, project) => {
    return (dispatch) => {
        console.log(memberEmail, project)
        let payload = {
            memberEmail,
            project
        }
        axios.post("/project/assignNewTeamLeader", { payload }).then((res) => {
            payload = { ...payload, res }
            dispatch({ type: "ASSIGN_NEW_TEAM_LEADER", payload })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const inviteMoreMembers = (invitedUsers, project, userInfo) => {
    return (dispatch) => {
        const payload = {
            project,
            invitedUsers,
            userInfo
        }
        axios.post('/project/inviteUsers', { payload }).then((res) => {
            console.log(res)
            //redux has no role here
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const setProject = (project) => {
    return (dispatch) => {
        dispatch({ type: "SET_PROJECT", project })
    }
}

export const findUsers = (searchQuery) => {
    return (dispatch) => {
        axios.get('/project/findUsers?searchQuery=' + searchQuery).then((res) => {
            console.log(res.data, "finding users")
            dispatch({ type: "FIND_USERS", users: res.data })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}
// export const unAssignTask = payload =>{
//     return(dispatch)=>{
//         axios.post('/task/unAssignTask', {payload}).then((res)=>{
//             console.log(res)
//             payload = {...payload, res}
//             dispatch({type:"MODIFY_TASK", payload})
//         }).catch((exception)=>{
//             console.log(exception)
//         })
//     }
// }