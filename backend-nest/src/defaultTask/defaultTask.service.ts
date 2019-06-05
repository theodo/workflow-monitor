import { DefaultTask } from './defaultTask.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DefaultTaskList } from '../defaultTaskList/defaultTaskList.entity';
import { upsert } from '../database/database.utils';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Injectable()
export class DefaultTaskService {
  constructor(
    @Inject('DefaultTaskRepository') private readonly defaultTaskRepository: typeof DefaultTask,
    @Inject('DefaultTaskListRepository')
    private readonly defaultTaskListRepository: typeof DefaultTaskList,
  ) {}

  async getDefaultTasksList(defaultTasksListId) {
    return this.defaultTaskListRepository.findById(defaultTasksListId, {
      include: [
        {
          model: this.defaultTaskRepository,
          as: 'defaultTasks',
        },
      ],
    });
  }

  async getDefaultTasksListsByProject(projectId) {
    return this.defaultTaskListRepository.findAll({
      where: { id: projectId },
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
      await this.defaultTaskRepository.create(defaultTask);
    });
  }

  upsert(value, condition) {
    return upsert(this.defaultTaskListRepository, value, condition);
  }

  async saveDefaultTasksList(defaultTasksList, user: User) {
    const project = user.currentProject;

    const { id, defaultTasks, ...rest } = defaultTasksList;

    const persistedDefaultTasksList = id
      ? await this.upsert({ id, ...rest, projectId: project.id }, { id })
      : await this.upsert({ ...rest, projectId: project.id }, {});

    const formattedDefaultTasks = defaultTasks.map(defaultTask => ({
      ...defaultTask,
      defaultTasksListId: persistedDefaultTasksList.id,
    }));

    await this.refreshWithTasks(persistedDefaultTasksList.id, formattedDefaultTasks);

    return persistedDefaultTasksList.id;
  }
}
