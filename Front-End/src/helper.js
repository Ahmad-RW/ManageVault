
export const checkAuthority = (project, authority, userInfo) => {
    const member = project.members.find(member => member.email === userInfo.email)
    if(member.teamLeader){
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