import { DefaultTask } from './defaultTask.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DefaultTasksList } from '../defaultTasksList/defaultTasksList.entity';
import { upsert } from '../database/database.utils';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Injectable()
export class DefaultTaskService {
  constructor(
    @Inject('DefaultTaskRepository') private readonly defaultTaskRepository: typeof DefaultTask,
    @Inject('DefaultTasksListRepository')
    private readonly defaultTasksListRepository: typeof DefaultTasksList,
  ) {}

  async getDefaultTasksList(defaultTasksListId) {
    return this.defaultTasksListRepository.findById(defaultTasksListId, {
      include: [
        {
          model: this.defaultTaskRepository,
          as: 'defaultTasks',
        },
      ],
    });
  }

  async getDefaultTasksListsByProject(projectId) {
    return this.defaultTasksListRepository.findAll({
      where: { projectId },
      include: [
        {
          model: this.defaultTaskRepository,
          as: 'defaultTasks',
        },
      ],
      order: [[{ model: this.defaultTaskRepository, as: 'defaultTasks' }, 'id', 'ASC']],
    });
  }

  async refreshWithTasks(defaultTasksListId, defaultTasks) {
    await this.defaultTaskRepository.destroy({ where: { defaultTasksListId } });
    defaultTasks.map(async defaultTask => {
      const newDBTask = await this.defaultTaskRepository.create(defaultTask);
    });
  }

  upsert(value, condition) {
    return upsert(this.defaultTasksListRepository, value, condition);
  }

  async saveDefaultTasksList(defaultTasksList: DefaultTasksList, user: User): Promise<number> {
    const project = user.currentProject;

    const { id, defaultTasks, type } = defaultTasksList;

    let persistedDefaultTasksList: DefaultTasksList;

    persistedDefaultTasksList = await this.defaultTasksListRepository
      .findOrCreate({
        where: { projectId: project.id, type },
        defaults: { type, projectId: project.id },
        include: [
          {
            model: Project,
            as: 'project',
          },
        ],
      })
      .then(([taskslist, created]) => {
        return taskslist;
      });

    const formattedDefaultTasks = defaultTasks.map(defaultTask => ({
      ...defaultTask,
      defaultTasksListId: persistedDefaultTasksList.id,
    }));

    await this.refreshWithTasks(persistedDefaultTasksList.id, formattedDefaultTasks);

    return persistedDefaultTasksList.id;
  }
}
