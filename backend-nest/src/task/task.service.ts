import { Task } from './task.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Ticket } from '../ticket/ticket.entity';
import { Problem } from '../problem/problem.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TaskRepository') private readonly taskRepository: typeof Task,
    @Inject('ProblemRepository') private readonly problemRepository: typeof Problem,
  ) {}

  getTotatlTimeFromTasks = (tasks, key) =>
    tasks.reduce((total, task) => (task[key] ? total + task[key] : total), 0);

  formatTask = ticketId => ({
    description,
    estimatedTime,
    addedOnTheFly,
    realTime,
    problems,
    problemCategory,
  }) => ({
    description,
    estimatedTime,
    addedOnTheFly: addedOnTheFly || false,
    problems:
      problems || problemCategory
        ? [
            {
              description: problems,
              problemCategory,
            },
          ]
        : [],
    realTime,
    ticketId,
  });

  formatTasks = (state, ticket) => {
    const { tasks } = state;
    const { id: ticketId } = ticket;
    return tasks.map(this.formatTask(ticketId));
  };

  async refreshWithTasks(ticketId: number, formattedTasks: any[]) {
    await this.taskRepository.destroy({ where: { ticketId } });
    formattedTasks.reduce(async (previousPromise, formattedTask) => {
      if (previousPromise) {
        await previousPromise;
      }
      return this.createTask(formattedTask);
    }, Promise.resolve());
  }

  async createTask(formattedTask: any) {
    return await this.taskRepository.create(formattedTask).then(task => {
      formattedTask.problems.map(async formattedProblem => {
        formattedProblem.taskId = task.id;
        const problem = await this.problemRepository.create(formattedProblem);
        if (formattedProblem.problemCategory) {
          await problem.set('problemCategoryId', formattedProblem.problemCategory.id);
        }
        await problem.save();
      });
    });
  }

  async updateTask(task: Task) {
    const taskToUpdate = await Task.findByPk(task.id, {
      include: [{ model: Problem, as: 'problems' }],
    });
    const ticketToUpdate = await Ticket.findByPk(task.ticketId);

    const updatedEstimatedTime =
      ticketToUpdate.estimatedTime + task.estimatedTime - taskToUpdate.estimatedTime;
    const updatedRealTime = ticketToUpdate.realTime + task.realTime - taskToUpdate.realTime;
    await ticketToUpdate.update({
      estimatedTime: updatedEstimatedTime,
      realTime: updatedRealTime,
    });

    await taskToUpdate.update({ ...task });
    await Problem.destroy({ where: { taskId: taskToUpdate.id } });
    if (task.problems) {
      for (const formattedProblem of task.problems) {
        formattedProblem.taskId = taskToUpdate.id;
        const problem = await Problem.create(formattedProblem);
        if (formattedProblem.problemCategory) {
          await problem.set('problemCategoryId', formattedProblem.problemCategory.id);
        }
        await problem.save();
      }
    }
    return taskToUpdate;
  }
}
