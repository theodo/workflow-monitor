const { sequelize } = require('../../models');

class projectsDB {
  constructor(db) {
    this.db = db;
    this.model = this.db.models.project;
  }

  setProjectPerformanceType(projectPerformanceType, projectId) {
    return this.model.update(
      {
        performanceType: projectPerformanceType,
      },
      { where: { id: projectId } },
    );
  }

  updateProject(projectCelerity, projectDailyDevelopmentTime, projectId) {
    return this.model.update(
      {
        celerity: projectCelerity,
        dailyDevelopmentTime: projectDailyDevelopmentTime,
      },
      { where: { id: projectId } },
    );
  }

  findOrCreateProject(project, user) {
    return this.model
      .findOrCreate({
        where: { thirdPartyId: project.thirdPartyId },
        defaults: { ...project },
      })
      .spread(project => {
        user.setCurrentProject(project.id);
        return project;
      });
  }
}

module.exports = new projectsDB(sequelize);
