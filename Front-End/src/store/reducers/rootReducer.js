const initState = {
    isAuthenticated : false,
    projects : []
}

const rootReducer = (state = initState, action) =>{
    if(action.type === 'AUTHENTICATE_THE_USER'){
        return state = {
            isAuthenticated : true
        }
    }
    if(action.type === 'REMOVE_AUTH'){
        return state ={
            isAuthenticated : false
        }
    }
    if(action.type ==="CREATE_PROJECT"){
        console.log('long winded MAN', action.project)
    }

    return state
}

export default rootReducer