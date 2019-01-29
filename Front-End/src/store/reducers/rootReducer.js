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

    return state
}

export default rootReducer