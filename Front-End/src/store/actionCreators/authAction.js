import axios from 'axios'
//no need for payload because these are boolean changes
export const authenticate = () =>{
    return {
        type : 'AUTHENTICATE_THE_USER',
    }
}

export const removeAuth = () =>{
    return {
        type : 'REMOVE_AUTH'
    }
}
export const fetchUserInfo = (userEmail) =>{
    return (dispatch, getState) => {
        axios.get('/user/getUserData?userEmail='+userEmail).then((res)=>{
            console.log(res.data, 'continue dispatch')
            dispatch({type: "SET_USER_INFO", userInfo :res.data})
        }).catch((res)=>{
            alert("an exception occured trying to load your projects please try again later")
            dispatch({type:"REMOVE_AUTH"})
        })
    }
}


