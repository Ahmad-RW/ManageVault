import axios from 'axios'

export const createTask = (project, task) => {
    return (dispatch) => {
        console.log(project,"this is project")
        console.log(task,"this task")
        const payload = { project, task}
        axios.post('http://localhost:3333/task/newTask', {payload}).then((res) => {
            const payload = {project, task, res}
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
