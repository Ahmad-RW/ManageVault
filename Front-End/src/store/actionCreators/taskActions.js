import axios from 'axios'

export const createTask = (project, task) => {
    return (dispatch) => {
        console.log(project, "this is project")
        console.log(task, "this task")
        const payload = { project, task }
        axios.post('http://localhost:3333/task/newTask', { payload }).then((res) => {
            const payload = { project, task, res }
            dispatch({ type: "CREATE_TASK", payload })
            console.log(res, "response from back end")
        }).catch((exception) => {
            console.log(exception)
        })

    }
}

export const deleteTask = (task_id, PID) => {
    return(dispatch) => {
        console.log(task_id, ", Task ID")
        console.log(PID,", Project ID")
        const payload = { task_id, PID }
        axios.post('http://localhost:3333/task/deleteTask', {payload}).then((res) => {
            const payload = {task_id, PID, res}
            dispatch({ type: "DELETE_TASK", payload })
            console.log(res, "Response")
        }).catch((exception) => {
            console.log(exception)
        })
    }
}


export const newComment = (comment, task, project) => {
    return (dispatch) => {
        let payload = {comment, task, project}
        axios.post('http://localhost:3333/task/newComment', {payload}).then((res) => {
        payload = {...payload, res}    
        dispatch({type:"NEW_COMMENT", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const setDependancy = (payload) =>{
    return (dispatch)=>{
        axios.post('http://localhost:3333/task/setDependancy', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type: "MODIFY_TASK", payload })
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const submitTask = (payload) =>{
    return (dispatch)=>{
        axios.post("http://localhost:3333/task/submitTask", {payload}).then((res)=>{
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const confirmTaskSubmission = (payload)=>{
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/confirmTaskSubmission', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const editTask = (payload) =>{
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/editTask', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const assignTask = (payload) =>{
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/assignTask', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const newActivity = payload =>{
    return(dispatch)=>{
        axios.post("http://localhost:3333/task/newActivity", {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload })
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const checkActivity = payload =>{
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/checkActivity', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const unAssignTask = payload =>{
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/unAssignTask', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const watchTask = payload => {
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/watchTask', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const unWatchTask = payload => {
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/unWatchTask', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}

export const removeDependancy = payload =>{
    return(dispatch)=>{
        axios.post('http://localhost:3333/task/removeDependancy', {payload}).then((res)=>{
            console.log(res)
            payload = {...payload, res}
           // dispatch({type:"MODIFY_TASK", payload})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}