//no need for payload because these are boolean changes
export const authenticate = () =>{
    return {
        type : 'AUTHENTICATE_THE_USER',
    }
}

export const removeAuth = () =>{
    return {
        type : 'REMOVE_AUTH'
    }
}

