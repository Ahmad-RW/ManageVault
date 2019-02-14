export const getProject = (projects) =>{
        let tmp = projects.find(project => {return project._id === localStorage.getItem("currentProject")})
        const currentProject = {...tmp}
        console.log(currentProject)
        return currentProject
    
}