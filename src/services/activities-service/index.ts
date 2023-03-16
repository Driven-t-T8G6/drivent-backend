import activityRepository from "@/repositories/activities-repository"

async function getActivities(){
    return await activityRepository.getActivities()
}

const activityService = {
    getActivities
}

export default activityService