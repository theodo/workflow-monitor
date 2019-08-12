import { Ticket } from './ticket.entity';
import { Inject, Injectable } from '@nestjs/common';
import { upsert } from '../database/database.utils';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task.entity';
import { Problem } from '../problem/problem.entity';
import { ProblemCategory } from '../problemCategory/problemCategory.entity';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

const SELECT_DAILY_PERFORMANCE_HISTORY_QUERY = `
  SELECT date(\`createdAt\`) as \`creationDay\`,
  SUM(CASE WHEN \`allocatedTime\` < \`realTime\` THEN 1 ELSE 0 END) AS \`celerityFailedTicketsCount\`,
  SUM(CASE WHEN \`estimatedTime\` < \`realTime\` THEN 1 ELSE 0 END) AS \`casprFailedTicketsCount\`,
  SUM(CASE WHEN \`estimatedTime\` < \`realTime\` THEN \`realTime\` - \`estimatedTime\` ELSE 0 END) AS \`overtime\`
  FROM \`tickets\`
  WHERE
    \`projectId\`=:projectId
    AND \`createdAt\` BETWEEN :startDate AND :endDate
  GROUP BY date(\`createdAt\`)
  ORDER BY date(\`createdAt\`);
`;

@Injectable()
export class TicketService {
  constructor(
    @Inject('TicketRepository') private readonly ticketRepository: typeof Ticket,
    @Inject('TaskRepository') private readonly taskRepository: typeof Task,
    private readonly taskService: TaskService,
  ) {}

  async getDailyPerformanceHistory(startDate, endDate, projectId) {
    return this.ticketRepository.sequelize.query(SELECT_DAILY_PERFORMANCE_HISTORY_QUERY, {
      replacements: { projectId, startDate, endDate },
      type: this.ticketRepository.sequelize.QueryTypes.SELECT,
    });
  }

  formatFullTicket = (state, project: Project, user, allocatedTime) => {
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
      complexity: points,
      celerity: project.celerity,
      dailyDevelopmentTime: project.dailyDevelopmentTime,
      allocatedTime,
      estimatedTime,
      realTime,
      trelloId: state.currentTrelloCard.id,
    };
  };

  async getTicket(ticketId: number) {
    return this.ticketRepository.findByPk(ticketId, {
      include: [
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: Problem,
              as: 'problems',
              include: [
                {
                  model: ProblemCategory,
                  as: 'problemCategory',
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getTicketsByProject(projectId, limit, offset) {
    return this.ticketRepository.findAndCountAll({
      where: { projectId },
      limit,
      order: [['createdAt', 'DESC']],
      offset,
    });
  }

  async updateThirdPartyId(ticketId, thirdPartyId) {
    return this.ticketRepository.update({ thirdPartyId }, { where: { id: ticketId } });
  }

  upsert(value, condition) {
    return upsert(this.ticketRepository, value, condition);
  }

  getAllocatedTimeFromPointsAndCelerity = (
    points: number,
    celerity: number,
    dailyDevelopmentTime: number,
  ) => {
    if (points === null) {
      return null;
    }
    if (!celerity || !dailyDevelopmentTime) {
      return 0;
    }

    return Math.round((points / celerity) * dailyDevelopmentTime);
  };

  async saveTicket(user: User, state: string) {
    // TODO: Refactor this part, use object instead of state string
    const project = user.currentProject;
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
