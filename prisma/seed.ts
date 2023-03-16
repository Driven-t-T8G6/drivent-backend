import { PrismaClient, TicketStatus } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }
  console.log({ event });

  let ticketType = await prisma.ticketType.findFirst();
  if (!ticketType) {
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
  }

  // let ticket = await prisma.ticket.findFirst();
  // console.log(ticket);
  // if(!ticket) {
  //   await prisma.ticket.create({
  //     data: {
  //       ticketTypeId: 1,
  //       enrollmentId: 1,
  //       status: TicketStatus.PAID,
  //     }
  //   })
  // }

  let Hotel = await prisma.hotel.findFirst();
  if (!Hotel) {
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
  }

  let Room = await prisma.room.findFirst(/*{
    /*include: {
      Booking: true,
    },
  }*/);
  console.log(Room);
  if (!Room) {
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
  }

  // let Booking = await prisma.booking.findFirst({
  //   include: {
  //     Room: true
  //   }
  // });
  // console.log(Booking);
  // if(!Booking) {
  //   await prisma.booking.create({
  //     data: {
  //       userId: 1,
  //       roomId: 1
  //     }
  //   })
  // }

let activies = await prisma.activity.createMany({
  data: [
    {
      title: 'Primeira Atividade',
      capacity: 50,
      location: 'Sala de Workshop',
      startsAt: new Date(Date.parse('2023-03-22 10:30:00')),
      endsAt: new Date(Date.parse('2023-03-23 12:30:00'))
    },
    {
      title: 'Segunda Atividade',
      capacity: 30,
      location: 'Auditório Principal',
      startsAt: new Date(Date.parse('2023-03-21 10:00:00')),
      endsAt: new Date(Date.parse('2023-03-22 13:00:00'))
    },
    {
      title: 'Terceira Atividade',
      capacity: 30,
      location: 'Auditório Lateral',
      startsAt: new Date(Date.parse('2023-03-21 11:00:00')),
      endsAt: new Date(Date.parse('2023-03-22 13:00:00'))
    }
  ]
})

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
