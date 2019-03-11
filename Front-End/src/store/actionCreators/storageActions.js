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