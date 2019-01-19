import axios from 'axios'
export  const createProjectAction = (project) =>{
    return(dispatch, getState) =>{
        console.log(project)
        //async call to database. after that the dispatcher is sent 
        axios.post('http://localhost:3333/newproject',{project : project}).then((res) => {
            dispatch({ type: "CREATE_PROJECT", project })
            console.log(res, "response from back end")
        }).catch((exception) => {
            console.log(exception)
        })
        
    }
//using thunk instead of returning an object as you would usually do. You would return a function as implemented above
//when a component calls this as a dispatch. We halt the dispatch action and do database query. Which is an async request. 
//after adding to the data base the dispatcher continues his role.
}




//this action creator is used to fetch projects from the database. With thunk also
export const fetchUserProjects = (userEmail) =>{
    return(dispatch, getState) =>{
        axios.get('http://localhost:3333/getUserProjects?userInfo = '+userEmail).then((res)=>{
            console.log(res.data, "in fetch projects action")
            dispatch({type: "SET_USER_PROJECTS",  projects : res.data})
        }).catch((exception)=>{
            console.log(exception)
        })
    }
}