import { unauthorizedError } from "@/errors";
import activityRepository from "@/repositories/activities-repository"
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository"


async function getActivities(userId: number) {
    const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollmentWithAddress) throw unauthorizedError()

    const verifyUserTicket = await ticketRepository.findTicketByEnrollmentId(enrollmentWithAddress.id)
    if (!verifyUserTicket) throw unauthorizedError()

    const verifyTicketType = await ticketRepository.findTickeWithTypeById(verifyUserTicket.id)
    if (verifyTicketType.TicketType.isRemote || verifyTicketType.status !== "PAID") throw unauthorizedError()


    return await activityRepository.getActivities()
}

const activityService = {
    getActivities
}

export default activityService