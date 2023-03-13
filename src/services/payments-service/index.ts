import { notFoundError, unauthorizedError } from "@/errors";
import paymentRepository, { PaymentParams } from "@/repositories/payment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import stripe from "@/config/stripe";

async function verifyTicketAndEnrollment(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findTickeyById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }
  const enrollment = await enrollmentRepository.findById(ticket.enrollmentId);

  if (enrollment.userId !== userId) {
    throw unauthorizedError();
  }
}

async function getPaymentByTicketId(userId: number, ticketId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const payment = await paymentRepository.findPaymentByTicketId(ticketId);

  if (!payment) {
    throw notFoundError();
  }
  return payment;
}

async function paymentProcess(ticketId: number, userId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);

  const ticket = await ticketRepository.findTickeWithTypeById(ticketId);
  const value = ticket.TicketType.price;
  const priceId: string = (value === 100 ? 'price_1Ml34ILlHdvTrLnrkAP1pqHR' : (value === 250 ? 'price_1Ml362LlHdvTrLnrMpH7eqVA' : 'price_1Ml36kLlHdvTrLnr7sqXGj19'));

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/dashboard/payment/completed?success=true&ticketId=` + ticketId,
    cancel_url: `http://localhost:3000/dashboard/payment/completed?success=false` ,
  });

  return session;

}

async function paymentConfirmation(ticketId: number, userId: number) {
  await verifyTicketAndEnrollment(ticketId, userId);
  return await ticketRepository.ticketProcessPayment(ticketId);
}


export type CardPaymentParams = {
  issuer: string,
  number: number,
  name: string,
  expirationDate: Date,
  cvv: number
}

const paymentService = {
  getPaymentByTicketId,
  paymentProcess,
  paymentConfirmation
};

export default paymentService;
