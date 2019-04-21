import axios from 'axios'
export const storageUpload = payload => {
    return (dispatch) => {
        axios.post("/storage/fileUpload", { payload }).then((res) => {
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
        axios.post("/storage/publishProject", {project}).then(res=>{
            let payload = {res, project}
            dispatch({type:"CHANGE_PUBLIC_STATUS", payload})

        }).then((exception)=>{
            console.log(exception)
        })
    }
}

export const unpublishProject = project =>{
    return(dispatch)=>{
        axios.post("/storage/unpublishProject", {project}).then(res=>{
            let payload = {res, project}
            dispatch({type:"CHANGE_PUBLIC_STATUS", payload})
        }).then((exception)=>{
            console.log(exception)
        })
    }
}

export const exportDocuments = payload =>{
    return(dispatch)=>{
        axios.post("/dropbox/export", {payload}).then(res=>{
            // let payload = {res, project}
            // dispatch({type:"CHANGE_PUBLIC_STATUS", payload})
            console.log(res)
        }).then((exception)=>{
            console.log(exception)
        })
    }
}

export const handleDBXImport = payload =>{
    return dispatch=>{
        axios.post('/dropbox/import', {payload}).then((res)=>{
          payload ={...payload , res}
          dispatch({type:"MODIFY_TASK", payload})
        }).catch((err)=>{
          console.log(err)
        })
    }
}
export const deleteDocument = payload =>{
    return(dispatch)=>{
        axios.post("/storage/deleteDocument", {payload}).then((res)=>{
            console.log(res)
            payload ={...payload, res}
            dispatch({type:"MODIFY_TASK", payload})
        }).catch((err)=>{
            console.log(err)
        })
    }
}