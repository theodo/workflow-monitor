import { Ticket } from './ticket.entity';
import { Inject, Injectable } from '@nestjs/common';
import { upsert } from '../database/database.utils';
import { TaskService } from '../task/task.service';
import { Task } from 'src/task/task.entity';

const SELECT_DAILY_PERFORMANCE_HISTORY_QUERY = `
  SELECT date("createdAt") as "creationDay",
  SUM(CASE WHEN "allocatedTime" < "realTime" THEN 1 ELSE 0 END) AS "celerityFailedTicketsCount",
  SUM(CASE WHEN "estimatedTime" < "realTime" THEN 1 ELSE 0 END) AS "casprFailedTicketsCount",
  SUM(CASE WHEN "estimatedTime" < "realTime" THEN "realTime" - "estimatedTime" ELSE 0 END) AS "overtime"
  FROM "tickets"
  WHERE
    "projectId"=:projectId
    AND "createdAt" BETWEEN :startDate AND :endDate
  GROUP BY date("createdAt")
  ORDER BY date("createdAt");
`;

@Injectable()
export class TicketService {
  constructor(
    @Inject('TicketRepository') private readonly ticketRepository: typeof Ticket,
    @Inject('TaskRepository') private readonly taskRepository: typeof Task,
    private readonly taskService: TaskService,
  ) {}

  getDailyPerformanceHistory(startDate, endDate, projectId): any {
    return this.ticketRepository.sequelize.query(SELECT_DAILY_PERFORMANCE_HISTORY_QUERY, {
      replacements: { projectId, startDate, endDate },
      type: this.ticketRepository.sequelize.QueryTypes.SELECT,
    });
  }

  formatFullTicket = (state, project, user, allocatedTime) => {
    const {
      currentTrelloCard: { idShort: thirdPartyId, name: description, ticketPoints: points },
      tasks,
    } = state;
    const { id: projectId } = project;
    const { id: userId } = user;

    const estimatedTime = this.taskService.getTotatlTimeFromTasks(tasks, 'estimatedTime');
    const realTime = this.taskService.getTotatlTimeFromTasks(tasks, 'realTime');

    return {
      thirdPartyId: thirdPartyId.toString(),
      description,
      status: 'DONE',
      userId,
      projectId,
      points,
      celerity: project.celerity,
      dailyDevelopmentTime: project.dailyDevelopmentTime,
      allocatedTime,
      estimatedTime,
      realTime,
    };
  };

  getTicket(ticketId): any {
    // return this.ticketRepository.findById(ticketId, {
    //   include: {
    //     model: this.taskRepository,
    //     as: 'tasks',
    //     // include: {
    //     //   model: this.db.models.problem,
    //     //   as: 'problems',
    //     //   include: {
    //     //     model: this.db.models.problemCategory,
    //     //     as: 'problemCategory',
    //     //   },
    //     // },
    //   },
    // });

    return this.ticketRepository.findById(ticketId);
  }

  // TODO: implement after implementing Project

  // getTicketsByProject(projectId, limit, offset) {
  //   return this.ticketRepository.findAndCountAll({
  //     where: { projectId },
  //     limit,
  //     order: [['createdAt', 'DESC']],
  //     offset,
  //   });
  // }

  updateThirdPartyId(ticketId, thirdPartyId): any {
    return this.ticketRepository.update({ thirdPartyId }, { where: { id: ticketId } });
  }

  upsert(value, condition) {
    return upsert(this.ticketRepository, value, condition);
  }

  getAllocatedTimeFromPointsAndCelerity = (points, celerity, dailyDevelopmentTime) => {
    if (points === null) {
      return null;
    }
    if (!celerity || !dailyDevelopmentTime) {
      return 0;
    }

    return Math.round((points / celerity) * dailyDevelopmentTime);
  };

  async saveTicket(user, state) {
    // const project = user.currentProject;
    const project = {
      id: 1,
      celerity: 6,
      dailyDevelopmentTime: 3600000,
    };
    const jsState = JSON.parse(state);
    const allocatedTime = this.getAllocatedTimeFromPointsAndCelerity(
      jsState.currentTrelloCard.ticketPoints,
      project.celerity,
      project.dailyDevelopmentTime,
    );

    const formattedTicket = this.formatFullTicket(jsState, project, user, allocatedTime);

    const ticket = await this.upsert(formattedTicket, {
      thirdPartyId: formattedTicket.thirdPartyId,
    });

    const formattedTasks = this.taskService.formatTasks(jsState, ticket);
    await this.taskService.refreshWithTasks(ticket.id, formattedTasks);

    return ticket.id;
  }
}
