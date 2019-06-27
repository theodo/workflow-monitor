import { Ticket } from './ticket.entity';

export const ticketsProvider = [
  {
    provide: 'TicketRepository',
    useValue: Ticket,
  },
];
