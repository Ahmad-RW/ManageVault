import axios from 'axios'
export const storageUpload = payload => {
    return (dispatch) => {
        axios.post("http://localhost:3333/storage/fileUpload", { payload }).then((res) => {
            console.log(res)
            payload = {
                ...payload,
                res,
                project : payload.projectInContext // dont mind this please move on with your life 
            }
            payload = {...payload, res}
            dispatch({type:"STORAGE_UPLOAD" ,payload})
        }).catch((exception) => {
            console.log(exception)
        })
    }
}

export const publishProject = project =>{
    return(dispatch)=>{
        axios.post("http://localhost:3333/storage/publishProject", {project}).then(res=>{
            let payload = {res, project}
            dispatch({type:"CHANGE_PUBLIC_STATUS", payload})

        }).then((exception)=>{
            console.log(exception)
        })
    }
}

export const unpublishProject = project =>{
    return(dispatch)=>{
        axios.post("http://localhost:3333/storage/unpublishProject", {project}).then(res=>{
            let payload = {res, project}
            dispatch({type:"CHANGE_PUBLIC_STATUS", payload})
        }).then((exception)=>{
            console.log(exception)
        })
    }
}

export const exportDocuments = payload =>{
    return(dispatch)=>{
        axios.post("http://localhost:3333/storage/export", {payload}).then(res=>{
            // let payload = {res, project}
            // dispatch({type:"CHANGE_PUBLIC_STATUS", payload})
        }).then((exception)=>{
            console.log(exception)
        })
    }
}