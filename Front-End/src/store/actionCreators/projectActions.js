export const createProject = (project) =>{
    return(dispatch, getState) =>{
        //async call to data base
        dispatch({type : 'CREATE_PROJECT', project})
    }

}//using thunk instead of returning an object as you would usually do. You would return a function as implemented above
//when a component calls this as a dispatch. We halt the dispatch action and do database query. Which is an async request. 
//after adding to the data base the dispatcher continues his role.