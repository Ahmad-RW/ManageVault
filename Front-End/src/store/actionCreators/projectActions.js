import axios from 'axios'
export const createProjectAction = (project, userInfo) => {
    return (dispatch, getState) => {
        //async call to database. after that the dispatcher is sent 
        axios.post('http://localhost:3333/project/newproject', { project, userInfo }).then((res) => {
            dispatch({ type: "CREATE_PROJECT", project : res.data })
        }).catch((exception) => {
            console.log(exception)
        })

    }
    //using thunk instead of returning an object as you would usually do. You would return a function as implemented above
    //when a component calls this as a dispatch. We halt the dispatch action and do database query. Which is an async request. 
    //after adding to the data base the dispatcher continues his role.
}


//this action creator is used to fetch projects from the database. With thunk also
export const fetchUserProjects = (userEmail) => {
    return (dispatch, getState) => {
        axios.get('http://localhost:3333/project/getUserProjects?userEmail=' + userEmail).then((res) => {
            console.log(res.data, "in fetch projects action")
            dispatch({ type: "SET_USER_PROJECTS", projects: res.data })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const requestDeleteAction = (project) => {
    return(dispatch) => {
        console.log(project)
        axios.post('http://localhost:3333/project/deleteproject', {project}).then((res) => {
            dispatch({ type: "REQUEST_DELETE", project})
            console.log(res)
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const requestToDeleteProject = (project, userInfo) =>{
    return(dispatch)=>{
        console.log(project, userInfo)
        console.log("In request to delete project")
        const payload ={ 
            project, 
            userInfo
        }
        axios.post('http://localhost:3333/project/requestDeleteProject', {project, userInfo}).then((res)=>{
            dispatch({ type: "REQUEST_TO_DELETE_PROJECT", payload})  
        console.log(res)
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}





export const leaveProject = (project, userInfo) => {
    return (dispatch, getState) => {
        console.log('in action')
        const payload = { project, userInfo }
        axios.post('http://localhost:3333/project/leaveProject', { project, userInfo }).then((res) => {
            dispatch({ type: "LEAVE_PROJECT", payload })
            console.log(res)
        })
    }
}

export const removeTeamMember = (project, member) => {
    console.log("remove action here")
    return (dispatch, getState) => {
        const payload = { project, member}
        axios.post('http://localhost:3333/project/removeTeamMember', { project, member}).then((res) => {
            dispatch({ type: "REMOVE_TEAM_MEMBER", payload })
            console.log(res)
        })
    }
}

export const handleInvite = (project, userInfo, notification) => {
    return (dispatch) => {
        const payload = { project, userInfo, notification }
        axios.post('http://localhost:3333/project/handleInvite', { project, userInfo, notification }).then((res) => {
            console.log(res)
            dispatch({ type: "ACCEPT_INVITE", payload })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}
export const handleNotificationDelete = (projectId, userInfo, notification)=>{
    console.log(userInfo)
    return (dispatch) =>{
        const payload = {projectId, userInfo, notification}
        axios.post('http://localhost:3333/project/handleNotificationDelete', {projectId, userInfo, notification}).then((res)=>{
            dispatch({type : "DELETE_NOTIFICATION", payload})
            console.log(res)
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}




export const handleVoting = (payload) => {
    console.log(payload, "IN ACTION")
    return (dispatch) => {
        axios.post("http://localhost:3333/project/handleVoting", {payload}).then((res) => {
            console.log(res)
            //dispatch({ type: "REQUEST_TO_DELETE_PROJECT", payload})
            console.log("DISPATCHED")
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const setAuthority = (payload) => {
return (dispatch)=>{
    axios.post('http://localhost:3333/project/setAuthority', {payload}).then((res)=>{
        console.log(res)
        dispatch({type : "SET_AUTHORITY", payload})
    }).catch((exception)=>{
        console.log(exception)
    })
}
}