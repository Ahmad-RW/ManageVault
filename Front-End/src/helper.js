import { default as Chatkit } from '@pusher/chatkit-server';

const chatkit = new Chatkit({
    instanceLocator: "v1:us1:284bc324-9274-4bee-b49f-efd146384063",
    key: "8e5a1191-4999-417c-87e3-a2ccb54c775b:EgBlYSiXIv9TFfqSM/cQxO9ECOR5jXhemLqcHCwNrhE="
})

export const checkAuthority = (project, authority, userInfo) => {
    const member = project.members.find(member => member.email === userInfo.email)
    if (member.teamLeader) {
        return true
    }
    console.log(member)
    console.log("HEHE")
    let result = false
    member.roles.forEach(element => {
        if (element.authorities.includes(authority)) {
            console.log(element, "ELEMENT")
            result = true
        }
    });
    console.log(result, authority)
    return result
}

export const setChatId = project =>{
    console.log("hey")
    chatkit.createRoom({
        creatorId: "ManageVault",
        name : project.title
    }).then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
}

export const makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export const normalizeDate = (date) => {
    var date = date.split("T")
    var time = date[1].split(":")[0] + ":" + date[1].split(":")[1]
    const normalizedDate = {
        date,
        time
    }
    return normalizedDate
}
export const isMemberAssigned = (task, member) => {
    
    var result = false 
    const assignedMembers = task.assignedMembers
    assignedMembers.forEach(assignedMember => {
        if (member.email === assignedMember.email) {
            result = true
        }
    })
    return result
}

export const isUserTeamLeader = (userInfo, project) => {
    var result = false
    const members = project.members
    members.forEach(member => {
        if (member.email === userInfo.email && member.teamLeader) {
            result = true
        }
    })
    return result
}

export const getAbsoluteValue = (number) => {  
        if(number < 0)
            return number * -1;
        return number;
}

export const isTaskSubmitted = (taskId, project) =>{
    var result = false
    project.tasks.forEach(task=>{
        if(task._id === taskId && task.status === "SUBMITTED"){
            result = true
        }
    })
    return result
}

export const isTaskPending = (taskId, project) =>{
    var result = false
    project.tasks.forEach(task=>{
        if(task._id === taskId && task.status === "PENDING_FOR_CONFIRMATION"){
            result = true
        }
    })
    return result
}

export const isOutputTaskSubmitted = (outputOf, project) =>{
    let result = false
    project.tasks.forEach(task=>{
        task.outputDocuments.forEach(output=>{
            if(output.name === outputOf && task.status === "SUBMITTED"){
                result = true
            }
        })
    })
    return result
}