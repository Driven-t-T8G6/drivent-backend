import { prisma } from "@/config";

async function getActivities() {
    return await prisma.activity.findMany()
}

const activityRepository = {
    getActivities
}

export default activityRepository