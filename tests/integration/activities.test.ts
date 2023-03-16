import app, { init } from "@/app";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";
import supertest from "supertest";
import { createBooking, createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketType, createTicketTypeWithHotel, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { Activity } from "@prisma/client";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app)

describe('GET /activity/', () => {
    it('should respond with status 200 and a list of activities', async () => {
        //create user
        const user = await createUser();
        //validate user with valid token
        const token = await generateValidToken(user);
        //create enrollment to user
        const enrollment = await createEnrollmentWithAddress(user);
        //create the type of the ticket
        const ticketType = await createTicketTypeWithHotel();
        //create a ticket and user buy it
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        //the user pay the ticket
        const payment = await createPayment(ticket.id, ticketType.price);
        //create the hotel
        const hotel = await createHotel();
        //create the room
        const room = await createRoomWithHotelId(hotel.id);
        //user make a booking of the room
        const booking = await createBooking({
            userId: user.id,
            roomId: room.id,
        });

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
})