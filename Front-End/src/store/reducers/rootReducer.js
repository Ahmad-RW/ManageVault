const initState = {
    isAuthenticated : false
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
    return state
}

export default rootReducer