export const loadState= () =>{
    try{
        const serializedProjectInContext = localStorage.get("projectInContext")
        if(serializedProjectInContext === null){
            return undefined
        }
        return JSON.parse(serializedProjectInContext);
    } catch(err){
        return undefined
    }
}


export const saveState = (state) =>{
    try { 
        const serializedProjectInContext = JSON.stringify(state)
        console.log(serializedProjectInContext) 
        localStorage.setItem("projectInContext", serializedProjectInContext)
    } catch(err){
        console.log(err)
    }
}