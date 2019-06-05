import { Project } from './project.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
  constructor(@Inject('ProjectRepository') private readonly projectRepository: typeof Project) {}

  setProjectPerformanceType(projectPerformanceType, projectId): any {
    return this.projectRepository.update(
      {
        performanceType: projectPerformanceType,
      },
      { where: { id: projectId } },
    );
  }

  updateProject(projectCelerity, projectDailyDevelopmentTime, projectId): any {
    return this.projectRepository.update(
      {
        celerity: projectCelerity,
        dailyDevelopmentTime: projectDailyDevelopmentTime,
      },
      { where: { id: projectId } },
    );
  }

  findOrCreateProject(project, user): any {
    return this.projectRepository
      .findOrCreate({
        where: { thirdPartyId: project.thirdPartyId },
        defaults: { ...project },
      })
      .then(([foundOrCreatedProject, created]) => {
        user.setCurrentProject(foundOrCreatedProject.id);
        return foundOrCreatedProject;
      });
  }
}
