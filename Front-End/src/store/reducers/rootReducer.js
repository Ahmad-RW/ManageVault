const initState = {
    isAuthenticated: false,
    projects: [],
    userInfo: {}
}

const rootReducer = (state = initState, action) => {
    if (action.type === 'AUTHENTICATE_THE_USER') {
        return state = {
            ...state,
            isAuthenticated: true
        }
    }
    if (action.type === 'REMOVE_AUTH') {
        return state = {
            ...state,
            isAuthenticated: false
        }
    }
    if (action.type === "SET_USER_INFO") {
        return state = {
            ...state,
            userInfo: action.userInfo
        }
    }
    if (action.type === "CREATE_PROJECT") {
        let newProjects = state.projects
        newProjects.push(action.project)
        return state = {
            ...state,
            projects: newProjects
        }
    }
    if (action.type === "SET_USER_PROJECTS") {
        console.log("in reducer")
        return state = {
            ...state,
            projects: action.projects
        }
    }
    if (action.type === "REQUEST_DELETE") {
        for (var i = 0; i < this.state.projects.length; i++) {
            if (this.state.project[i] === this.props.action.project.id) {
                const project = this.state.project[i];
                console.log(project);
                let updatedProjects = state.projects
                updatedProjects.filter(project.id === this.props.action.project.id);
                console.log(state);
                return state = {
                    ...state,
                    projects: updatedProjects
                }
            }
        }
    }
    if(action.type === "REQUEST_TO_DELETE_PROJECT"){
        let newProjects = state.projects;
        let project = newProjects.find(project => project._id === action.payload.project._id)
        project.status = 'PENDING';
        newProjects = {
            ...project
        }
    }
    if(action.type === "LEAVE_PROJECT"){
        console.log("in reducer")
        const newProjects = state.projects.filter(project=>{
           return project._id !== action.payload.project._id
        })
      console.log(newProjects)
      return state ={
          ...state, 
          projects : newProjects
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