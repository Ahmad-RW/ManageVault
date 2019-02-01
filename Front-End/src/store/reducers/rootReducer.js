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
        state = {
            ...state,
            projects: newProjects
        }
        return state
    }
    if (action.type === "SET_USER_PROJECTS") {
        console.log("in reducer")
        return state = {
            ...state,
            projects: action.projects
        }
    }
    if (action.type === "REQUEST_DELETE") {
        for (var i = 0; i < state.projects.length; i++) {
            if (state.projects[i]._id === action.project._id) {
                const project = state.projects[i];
                console.log(project);
                let updatedProjects = state.projects.filter(project => { return project._id !== action.project._id });
                console.log(state);
                state = {
                    ...state,
                    projects: updatedProjects
                }
                console.log(state)
                
            }
        }
        return state
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
        console.log(action.payload, "payload")
        let newNotifications = state.userInfo.notifications.filter(notification => {return action.payload.notification._id !== notification._id});
        console.log(newNotifications, "new notifications")
       let newUserInfo = {
            ...state.userInfo,
            notifications : newNotifications
        }
        console.log(newUserInfo, "new user info")
        state ={
            ...state,
            userInfo : newUserInfo
        }
        console.log(state)
        return state
    }
    if(action.type === "REMOVE_TEAM_MEMBER"){
        let newProject = state.projects.find(project => {return action.payload.project._id === project._id})
        let newProjectsList = state.projects.filter(project => {return action.payload.project._id !== project._id})
        let newMembers = newProject.members.filter(member => {return action.payload.member.email !== member.email});
        console.log(newMembers,"new Members")
        newProject = {
            ...newProject,
            members: newMembers
        }
        console.log(newProject,"the project we modified")
        newProjectsList.push(newProject)
        state = {
            ...state,
            projects: newProjectsList
        }
        console.log(state,"هذي الستييييت")
        return state
    }

    if(action.type === "DELETE_NOTIFICATION"){
        console.log('in reducer delete')
         
       let newNotifications = state.userInfo.notifications.filter(notification => {return action.payload.notification._id !== notification._id});
        let newUserInfo = {
            ...state.userInfo,
            notifications : newNotifications
        }
      return state ={
            ...state,
            userInfo : newUserInfo
        }
    }

    return state
}

export default rootReducer