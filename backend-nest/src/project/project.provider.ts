import { Project } from './project.entity';

export const projectsProvider = [
  {
    provide: 'ProjectRepository',
    useValue: Project,
  },
];
