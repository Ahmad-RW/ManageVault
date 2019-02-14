
const initState = {
    projectInContext: {}
}
const projectInContextReducer = (state = initState, action) => {
    if (action.type === "SET_PROJECT") {
        // return state = {
        //     ...state,
        //     projectInContext: action.project
        // } // if entire project is passed
        console.log("SETTING PROJECT")
        let newProjectInContext = {}
        state.projects.forEach(project => {
            if (project._id === action.project) {
                newProjectInContext = { ...project }
            }
        })
        console.log(state, "OLD STATE")
        console.log(newProjectInContext)
        state = {
            ...state,
            projectInContext: newProjectInContext
        }
        console.log(state)
        return state
    }


    if (action.type === "CREATE_TASK") {
        console.log(action.payload)
        const oldProjects = state.projects.filter(project => project.id !== action.payload.project._id)
        const newProjects = [...oldProjects, action.payload.res.data]
        return state = {
            ...state,
            projectInContext: action.payload.res.data,
            projects: newProjects
        }
    }
    return state
}

export default projectInContextReducer