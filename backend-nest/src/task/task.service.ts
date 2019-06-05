import { Task } from './task.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Ticket } from '../ticket/ticket.entity';
import { Problem } from '../problem/problem.entity';

@Injectable()
export class TaskService {
  constructor(@Inject('TaskRepository') private readonly taskRepository: typeof Task) {}

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

  async refreshWithTasks(ticketId, formattedTasks) {
    await this.taskRepository.destroy({ where: { ticketId } });
    formattedTasks.map(async formattedTask => {
      const task = await this.taskRepository.create(formattedTask);

      formattedTask.problems.map(async formattedProblem => {
        formattedProblem.taskId = task.id;

        // TODO: uncomment this after adding problem module

        // const problem = await this.db.models.problem.create(formattedProblem);
        // formattedProblem.problemCategory &&
        //   problem.setProblemCategory(formattedProblem.problemCategory.id);
        // await problem.save();
      });
    });
  }

  async updateTask(task: Task) {
    const taskToUpdate = await Task.findById(task.id, {
      include: [{ model: Problem, as: 'problems' }],
    });
    const ticketToUpdate = await Ticket.findById(task.ticket.id);
    const updatedEstimatedTime =
      ticketToUpdate.estimatedTime + task.estimatedTime - taskToUpdate.estimatedTime;
    const updatedRealTime = ticketToUpdate.realTime + task.realTime - taskToUpdate.realTime;
    await ticketToUpdate.update({
      estimatedTime: updatedEstimatedTime,
      realTime: updatedRealTime,
    });
    await taskToUpdate.update(task);

    // TODO: implement after adding Problems:

    // await Problem.destroy({ where: { taskId: taskToUpdate.id } });
    // if (task.problems) {
    //   for (let formattedProblem of task.problems) {
    //     formattedProblem.taskId = taskToUpdate.id;
    //     const problem = await Problem.create(formattedProblem);
    //     formattedProblem.problemCategory &&
    //       (await problem.setProblemCategory(formattedProblem.problemCategory.id));
    //     await problem.save();
    //   }
    // }
    return taskToUpdate;
  }
}
