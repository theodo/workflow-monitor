import { Inject, Injectable } from '@nestjs/common';
import { Problem } from '../problem/problem.entity';
import { ProblemCategory } from './problemCategory.entity';
import sequelize = require('sequelize');

const SELECT_PROBLEM_CATEGORY_COUNT_AND_OVERTIME_QUERY = `
  SELECT "categories".id, "categories"."description", COUNT("problemsWithOvertime"."problemCategoryId"),
  SUM("problemsWithOvertime"."overtime") as "overtime"
  FROM (SELECT * FROM "problemCategories" WHERE "problemCategories"."projectId" = :projectId) AS "categories"
  INNER JOIN (
    SELECT "problems".id, "problems"."problemCategoryId", "tasks"."realTime" - "tasks"."estimatedTime" AS "overtime"
    FROM "tasks", "problems"
    WHERE "problems"."taskId" = "tasks".id AND "tasks"."estimatedTime" < "tasks"."realTime" 
    AND "tasks"."createdAt" > :startDate AND "tasks"."createdAt" < :endDate
  ) as "problemsWithOvertime"
  ON "categories".id = "problemsWithOvertime"."problemCategoryId"
  GROUP BY "categories".id, "categories"."description"
  ORDER BY "overtime" DESC
`;

@Injectable()
export class ProblemCategoryService {
  constructor(
    @Inject('ProblemRepository') private readonly problemRepository: typeof Problem,
    @Inject('ProblemCategoryRepository')
    private readonly problemCategoryRepository: typeof ProblemCategory,
  ) {}

  async getAll() {
    return this.problemCategoryRepository.findAll();
  }

  async getAllByProject(projectId) {
    return this.problemCategoryRepository.findAll({
      // attributes: [
      //   {
      //     include: [sequelize.fn('COUNT', sequelize.col('problems.id')), 'problemCount'],
      //   },
      // ],
      include: [
        {
          model: this.problemRepository,
          as: 'problems',
          attributes: [],
        },
      ],
      where: { id: projectId },
      group: ['problemCategory.id'],
    });
  }

  getCountAndOvertime(projectId, startDate, endDate): any {
    startDate = startDate ? startDate : new Date(0);
    endDate = endDate ? endDate : new Date();
    return this.problemCategoryRepository.sequelize.query(
      SELECT_PROBLEM_CATEGORY_COUNT_AND_OVERTIME_QUERY,
      {
        replacements: { projectId, startDate, endDate },
        type: this.problemCategoryRepository.sequelize.QueryTypes.SELECT,
      },
    );
  }

  async add(description, projectId) {
    return this.problemCategoryRepository.create({
      description,
      projectId,
    });
  }

  async updateDescription(problemCategoryId, description) {
    return this.problemCategoryRepository.update(
      { description },
      { where: { id: problemCategoryId } },
    );
  }

  async isProblemCategoryDeletable(problemCategoryId) {
    // const relatedProblems = await this.problemRepository.findAll({ where: { problemCategoryId } });
    const relatedProblems = await this.problemRepository.findAll({
      where: { id: problemCategoryId },
    });
    return relatedProblems.length === 0;
  }

  async deleteProblemCategory(problemCategoryId) {
    return this.problemCategoryRepository.destroy({ where: { id: problemCategoryId } });
  }
}
