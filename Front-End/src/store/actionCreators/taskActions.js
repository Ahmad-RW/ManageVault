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
