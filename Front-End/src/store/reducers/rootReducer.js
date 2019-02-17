
const initState = {
    isAuthenticated: false,
    projects: [],
    userInfo: {},
    projectInContext: {}
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
        // let newProjects = state.projects creates a pointer only
        // newProjects.push(action.project)
        console.log(action.project)
        let newProjects = [...state.projects, action.project]
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
    if (action.type === "REQUEST_TO_DELETE_PROJECT") {
        let newProjects = state.projects;
        let project = newProjects.find(project => project._id === action.payload.project._id)
        project.status = 'PENDING';
        newProjects = {
            ...project
        }
    }
    if (action.type === "LEAVE_PROJECT") {
        console.log("in reducer")
        const newProjects = state.projects.filter(project => {
            return project._id !== action.payload.project._id
        })
        console.log(newProjects)
        return state = {
            ...state,
            projects: newProjects
        }
    }

    if (action.type === "ACCEPT_INVITE") {
        let newNotifications = state.userInfo.notifications.filter(notification => { return action.payload.notification._id !== notification._id });
        let newUserInfo = {
            ...state.userInfo,
            notifications: newNotifications
        }

        state = {
            ...state,
            userInfo: newUserInfo
        }
        return state
    }

    if (action.type === "REMOVE_TEAM_MEMBER") {
        let newProject = state.projects.find(project => { return action.payload.project._id === project._id })
        let newProjectsList = state.projects.filter(project => { return action.payload.project._id !== project._id })
        let newMembers = newProject.members.filter(member => { return action.payload.member.email !== member.email });
        console.log(newMembers, "new Members")
        newProject = {
            ...newProject,
            members: newMembers
        }
        console.log(newProject, "the project we modified")
        newProjectsList.push(newProject)
        state = {
            ...state,
            projects: newProjectsList
        }
        console.log(state, "هذي الستييييت")
        return state
    }

    if (action.type === "DELETE_NOTIFICATION") {
        console.log('in reducer delete')

        let newNotifications = state.userInfo.notifications.filter(notification => { return action.payload.notification._id !== notification._id });
        let newUserInfo = {
            ...state.userInfo,
            notifications: newNotifications
        }
        return state = {
            ...state,
            userInfo: newUserInfo
        }
    }
    if (action.type === "SET_AUTHORITY") {
        console.log("in reducer set authority")
        console.log(action.payload)
        const oldProjects = state.projects.filter(project => project._id !== action.payload.project._id)
        const newProjects = [...oldProjects, action.payload.res.data]
        return state = {
            ...state,
            projectInContext : action.payload.res.data,
            projects : newProjects
        }

    }

    if (action.type === "SET_PROJECT") {
        // return state = {
        //     ...state,
        //     projectInContext: action.project
        // } // if entire project is passed
        console.log("SETTING PROJECT")
        let newProjectInContext = {}
        state.projects.forEach(project => {
            if(project._id === action.project){
                newProjectInContext = {...project}
            }
        })
        console.log(state, "OLD STATE")
        console.log(newProjectInContext)
        state={
            ...state,
            projectInContext : newProjectInContext
        }
        console.log(state)
        return state
    }

    if (action.type === "CREATE_TASK") {
        // console.log("in reducer CREATE_TASK")
        // console.log(action.payload)
        // let newProject = null
        // let arrayProject = state.projects.filter(project => {
        //     if (action.payload.project._id === project._id ) {
        //         newProject = {
        //             ...project
        //         }
        //     }
        //     return action.payload.project._id === project._id
        // })

        // let newProjects = state.projects.filter(project => {
        //     return action.payload.project._id !== project._id
        // })
        // console.log(newProjects)
        // console.log(newProject)
        // let newTasks = newProject.tasks.slice()
        // newTasks = [// add the new task into the prject tasks array
        //     ...newTasks,
        //     action.payload.task
        // ]
        // console.log(newTasks)
        // newProject = { // make the new tasks array the tasks array in the project
        //     ...newProject,
        //     tasks : newTasks
        // }
        // console.log(newProject)
        // newProjects = [ // add the modefied project to the projects array
        //     ...newProjects,
        //     newProject
        // ]
        // console.log(newProjects)
        // return state = {
        //     ...state,
        //     projectInContext : newProject,
        //     projects: newProjects
        // }

        console.log(action.payload)
        const oldProjects = state.projects.filter(project => project._id !== action.payload.project._id)
        const newProjects = [...oldProjects, action.payload.res.data]
        return state = {
            ...state,
            projectInContext : action.payload.res.data,
            projects : newProjects
        }
    }

    if(action.type === "GET_CURRENT_PROJECT"){
        console.log(action.projectId,"action.projectId")
        const arrayProject = state.projects.filter(project => project.id !== action.projectId)
        console.log(arrayProject,"arrayProject")
        const currentProject = arrayProject.pop()
        console.log(currentProject,"currentProject")
        return state = {
            ...state,
            projectInContext : currentProject
        }
    }

    return state
}

export default rootReducer