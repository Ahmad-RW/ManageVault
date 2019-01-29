const initState = {
    isAuthenticated : false,
    projects : [],
    userInfo : {}
}

const rootReducer = (state = initState, action) =>{
    if(action.type === 'AUTHENTICATE_THE_USER'){
        return state = {
            ...state,
            isAuthenticated : true
        }
    }
    if(action.type === 'REMOVE_AUTH'){
        return state ={
            ...state,
            isAuthenticated : false
        }
    }
    if(action.type === "SET_USER_INFO"){
        return state = {
            ...state,
            userInfo : action.userInfo
        }
    }
    if(action.type ==="CREATE_PROJECT"){
        let newProjects = state.projects
        newProjects.push(action.project)
        return state = {
            ...state,
            projects : newProjects
        }
    }
    if(action.type === "SET_USER_PROJECTS"){
        console.log("in reducer")
        return state = {
            ...state,
            projects : action.projects
        }
    }
    if(action.type === "ACCEPT_INVITE"){
        console.log(action.payload)
        let newNotifications = state.userInfo.notifications
        newNotifications.filter(notification => {return action.payload.notification._id === notification._id});
        console.log(newNotifications)
       let newUserInfo = {
            ...state.userInfo,
            notifications : newNotifications
        }
        console.log(newUserInfo)
        return state ={
            ...state,
            userInfo : newUserInfo
        }
    }

    return state
}

export default rootReducer