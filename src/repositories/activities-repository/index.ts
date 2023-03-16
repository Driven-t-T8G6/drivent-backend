import { prisma } from "@/config";

async function getActivities() {
    return await prisma.activity.findMany()
}

async function getActivityById(id: number){
    return await prisma.activity.findFirst({
        where:{
            id
        }
    })
}

async function postUserToActivity(id: number, newValueToCapacity: number){
    return await prisma.activity.update({
        where:{
            id
        },
        data: {
            subscriptions: newValueToCapacity
        }
    })
}

async function activityFull(id: number){
    return await prisma.activity.update({
        where:{
            id
        },
        data: {
            atCapacity: true
        }
    })
}

const activityRepository = {
    getActivities,
    getActivityById,
    postUserToActivity,
    activityFull
}

export default activityRepository