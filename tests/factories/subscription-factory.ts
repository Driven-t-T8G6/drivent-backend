import { prisma } from "@/config";

export function createSubscription(userId: number, activityId: number){
    return prisma.subscriptions.create({
        data: {
            userId,
            activityId
        }
    })
}