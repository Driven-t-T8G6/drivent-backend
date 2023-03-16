import app, { init } from "@/app";
import { TicketStatus } from "@prisma/client";
import supertest from "supertest";
import { createBooking, createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketType, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { createActivityWithOneUser, createEmptyActivity, createFullActivity } from "../factories/activities-factory";
import { createSubscription } from "../factories/subscription-factory";

const server = supertest(app)

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe('GET /activity/', () => {
    it('should respond with status 200 and a list of activities', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        await createEmptyActivity()
        await createEmptyActivity()
        await createEmptyActivity()

        const response = await server.get('/activity').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    capacity: expect.any(Number),
                    location: expect.any(String),
                    atCapacity: expect.any(Boolean),
                    subscriptions: expect.any(Number),
                    startsAt: expect.any(String),
                    endsAt: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            ])
        )
    })

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/activity').set("Authorization", `Bearer`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 if token is wrong', async () => {


        const response = await server.get('/activity').set("Authorization", `Bearer 123321`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user does not have enrollment', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.get('/activity').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user does not have a ticket', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        const response = await server.get('/activity').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user have a ticket, but is not paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.get('/activity').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user have a ticket, but is online', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();

        const response = await server.get('/activity').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })
})

describe('POST /activity/', () => {
    it('should respond with status 200', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        const activity = await createEmptyActivity()

        const response = await server.post(`/activity/${activity.id}`).set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(201)
    })

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/activity/1').set("Authorization", `Bearer`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 if token is wrong', async () => {


        const response = await server.post('/activity/1').set("Authorization", `Bearer 123321`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user does not have enrollment', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.post('/activity/1').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user does not have a ticket', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);

        const response = await server.post('/activity/1').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user have a ticket, but is not paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const activity = await createEmptyActivity()

        const response = await server.post(`/activity/${activity.id}`).set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 401 when user have a ticket, but is online', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const activity = await createEmptyActivity()

        const response = await server.post(`/activity/${activity.id}`).set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 404 when activity does not exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        const response = await server.post('/activity/999').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(404)
    })

    it('should respond with status 400 when params are in wrong format', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        const response = await server.post('/activity/text').set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(400)
    })

    it('should respond with status 401 when the activity is full', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        const activity = await createFullActivity()

        const response = await server.post(`/activity/${activity.id}`).set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(401)
    })
})

describe('DELETE /activity/', () => {
    it('should respond with status 200', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        const activity = await createActivityWithOneUser()
        const subscription = await createSubscription(user.id, activity.id)

        const response = await server.delete(`/activity/${activity.id}`).set("Authorization", `Bearer ${token}`)

        expect(response.status).toEqual(200)
    })

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.delete('/activity/1').set("Authorization", `Bearer`)

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
    })

    it('should respond with status 404 when user are not in activity', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        const activity = await createEmptyActivity()

        const response = await server.delete(`/activity/${activity.id}`).set("Authorization", `Bearer ${token}`)
        expect(response.status).toEqual(404)
    })

    it('should respond with status 400 when params are in wrong format', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

        const response = await server.delete('/activity/text').set("Authorization", `Bearer ${token}`)
        console.log(response.body)
        expect(response.status).toEqual(400)
    })

})