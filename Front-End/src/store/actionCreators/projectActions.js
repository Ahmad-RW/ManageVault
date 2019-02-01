import axios from 'axios'
export const createProjectAction = (project) => {
    return (dispatch, getState) => {
        console.log(project)
        //async call to database. after that the dispatcher is sent 
        axios.post('http://localhost:3333/newproject', { project: project }).then((res) => {
            dispatch({ type: "CREATE_PROJECT", project })
            console.log(res, "response from back end")
        }).catch((exception) => {
            console.log(exception)
        })

    }
    //using thunk instead of returning an object as you would usually do. You would return a function as implemented above
    //when a component calls this as a dispatch. We halt the dispatch action and do database query. Which is an async request. 
    //after adding to the data base the dispatcher continues his role.
}

export const requestDeleteAction = (project) => {
    return(dispatch) => {
        console.log(project)
        axios.post('http://localhost:3333/deleteproject', {project}).then((res) => {
            dispatch({ type: "REQUEST_DELETE", project})
            console.log(res)
        }).catch((exception) => {
            console.log(exception)
        })
    }
}




//this action creator is used to fetch projects from the database. With thunk also
export const fetchUserProjects = (userEmail) => {
    return (dispatch, getState) => {
        axios.get('http://localhost:3333/getUserProjects?userEmail=' + userEmail).then((res) => {
            console.log(res.data, "in fetch projects action")
            dispatch({ type: "SET_USER_PROJECTS", projects: res.data })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const leaveProject = (project, userInfo) => {

    return (dispatch, getState) => {
        console.log('in action')
        const payload = { project, userInfo }
        axios.post('http://localhost:3333/leaveProject', { project, userInfo }).then((res) => {
            dispatch({ type: "LEAVE_PROJECT", payload })
            console.log(res)
        })
    }
}

export const removeTeamMember = (project, member) => {
    console.log("remove action here")
    return (dispatch, getState) => {
        const payload = { project, member}
        axios.post('http://localhost:3333/removeTeamMember', { project, member}).then((res) => {
            dispatch({ type: "REMOVE_TEAM_MEMBER", payload })
            console.log(res)
        })
    }
}

export const handleInvite = (project, userInfo, notification) => {
    console.log("in store")
    return (dispatch, getState) => {
        const payload = { project, userInfo, notification }
        axios.post('http://localhost:3333/handleInvite', { project, userInfo, notification }).then((res) => {
            console.log(res)
            dispatch({ type: "ACCEPT_INVITE", payload })
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

