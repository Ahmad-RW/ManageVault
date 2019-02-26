
export const checkAuthority = (project, authority, userInfo) => {
    const member = project.members.find(member => member.email === userInfo.email)
    if (member.teamLeader) {
        return true
    }
    let result = false
    member.roles.forEach(element => {
        if (element.authorities.includes(authority)) {
            result = true
        }
    });
    return result
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
    const assignedMembers = task.assignment.assignedMembers
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