import { prisma } from "@/config";
import faker from "@faker-js/faker";

type CreateActivityParams = {
    title: string,
    capacity: number,
    location: string,
    atCapacity: boolean,
    subscriptions: number,
    startsAt: string,
    endsAt: string,
    createdAt: string,
    updatedAt: string
}

export function createFullActivity() {
    return prisma.activity.create({
        data: {
            title: faker.name.findName(),
            capacity: 30,
            location: 'Auditório Principal',
            atCapacity: true,
            subscriptions: 30,
            startsAt: new Date(Date.parse('2023-03-21 10:00:00')),
            endsAt: new Date(Date.parse('2023-03-22 13:00:00'))
        }
    })
}

export function createEmptyActivity() {
    return prisma.activity.create({
        data: {
            title: faker.name.findName(),
            capacity: 30,
            location: 'Auditório Principal',
            atCapacity: false,
            subscriptions: 0,
            startsAt: new Date(Date.parse('2023-03-21 10:00:00')),
            endsAt: new Date(Date.parse('2023-03-22 13:00:00'))
        }
    })
}

export function createActivityWithOneUser() {
    return prisma.activity.create({
        data: {
            title: faker.name.findName(),
            capacity: 30,
            location: 'Auditório Principal',
            atCapacity: false,
            subscriptions: 1,
            startsAt: new Date(Date.parse('2023-03-21 10:00:00')),
            endsAt: new Date(Date.parse('2023-03-22 13:00:00'))
        }
    })
}
