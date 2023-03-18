import { PrismaClient, TicketStatus } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {

  await prisma.event.create({
    data: {
      title: 'Driven.t',
      logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
      backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
      startsAt: dayjs().toDate(),
      endsAt: dayjs().add(4, 'days').toDate(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      {
        name: 'Presencial',
        price: 250,
        includesHotel: false,
        isRemote: false,
      },
      {
        name: 'Online',
        price: 100,
        includesHotel: false,
        isRemote: true,
      },
      {
        name: 'Presencial',
        price: 600,
        includesHotel: true,
        isRemote: false,
      },
    ],
  });

  await prisma.hotel.createMany({
    data: [
      {
        name: 'Driven Resort',
        image: 'https://i.imgur.com/QDK2muM.png',
      },
      {
        name: 'Driven Palace',
        image: 'https://i.imgur.com/P3NKgmU.png',
      },
      {
        name: 'Driven World',
        image: 'https://i.imgur.com/9pAixTX.png',
      },
    ],
  });

  await prisma.room.createMany({
    data: [
      {
        name: '101',
        capacity: 3,
        hotelId: 1,
      },
      {
        name: '102',
        capacity: 2,
        hotelId: 1,
      },
      {
        name: '103',
        capacity: 3,
        hotelId: 1,
      },
      {
        name: '104',
        capacity: 1,
        hotelId: 1,
      },
      {
        name: '105',
        capacity: 1,
        hotelId: 1,
      },
      {
        name: '101',
        capacity: 3,
        hotelId: 2,
      },
      {
        name: '102',
        capacity: 3,
        hotelId: 2,
      },
      {
        name: '103',
        capacity: 1,
        hotelId: 2,
      },
      {
        name: '104',
        capacity: 1,
        hotelId: 2,
      },
      {
        name: '101',
        capacity: 1,
        hotelId: 3,
      },
      {
        name: '102',
        capacity: 1,
        hotelId: 3,
      },
      {
        name: '201',
        capacity: 2,
        hotelId: 1,
      },
      {
        name: '202',
        capacity: 3,
        hotelId: 1,
      },
    ],
  });

  await prisma.activity.createMany({
    data: [
      {
        id: 1,
        title: 'Primeira Atividade',
        capacity: 50,
        location: 'Auditório Principal',
        startsAt: new Date(dayjs().toDate().setHours(9, 0, 0, 0)),
        endsAt: new Date(dayjs().toDate().setHours(10, 0, 0, 0)),
      },
      {
        id: 2,
        title: 'Segunda Atividade',
        capacity: 35,
        location: 'Auditório Lateral',
        startsAt: new Date(dayjs().toDate().setHours(9, 0, 0, 0)),
        endsAt: new Date(dayjs().toDate().setHours(12, 0, 0, 0)),
      },
      {
        id: 3,
        title: 'Terceira Atividade',
        capacity: 15,
        location: 'Sala de Workshop',
        startsAt: new Date(dayjs().toDate().setHours(9, 0, 0, 0)),
        endsAt: new Date(dayjs().toDate().setHours(11, 0, 0, 0)),
      },
      {
        id: 4,
        title: 'Quarta Atividade',
        capacity: 50,
        location: 'Auditório Principal',
        startsAt: new Date(dayjs().toDate().setHours(10, 0, 0, 0)),
        endsAt: new Date(dayjs().toDate().setHours(11, 0, 0, 0)),
      },
      {
        id: 5,
        title: 'Quinta Atividade',
        capacity: 1,
        location: 'Sala de Workshop',
        startsAt: new Date(dayjs().toDate().setHours(11, 0, 0, 0)),
        endsAt: new Date(dayjs().toDate().setHours(12, 0, 0, 0)),
      },
      {
        id: 6,
        title: 'Sexta Atividade',
        capacity: 50,
        location: 'Auditório Principal',
        startsAt: new Date(dayjs().toDate().setHours(11, 0, 0, 0)),
        endsAt: new Date(dayjs().toDate().setHours(12, 0, 0, 0)),
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
