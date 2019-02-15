const fs = require('fs');
const { GraphQLServer, PubSub } = require('graphql-yoga')
const bodyParser = require('body-parser');
const { sequelize } = require('../models');
const { saveSessionToSkillpool } = require('./skillpool');
const { formatFullTicket, formatTasks } = require('./formatters');
const { upsert, SELECT_PROBLEM_CATEGORY_COUNT_QUERY } = require('./dbUtils');
const { authenticationMiddleware, loginRoute, websocketAuthenticationMiddleware } = require('./auth')

const isDev = process.env.NODE_ENV && process.env.NODE_ENV === 'development';

const Project = sequelize.models.project;
const ProblemCategory = sequelize.models.problemCategory;
const Ticket = sequelize.models.ticket;
const Task = sequelize.models.task;
const Problem = sequelize.models.problem;

const typeDefs = `
  type Query {
    hello: String!
    currentUser: User
    problemCategories: [ProblemCategory]
    problemCategoriesWithCount: [ProblemCategoryWithCount]
    tickets(pagination: PaginationInput): TicketList
    ticket(ticketId: Int): Ticket
  }
  type User {
    id: String,
    fullName: String,
    trelloId: String,
    currentProject: Project,
    state: String,
  }
  type Project {
    id: Int
    name: String
    thirdPartyType: String
    thirdPartyId: String
  }
  type TicketList {
    count: Int
    rows: [Ticket]
  }
  type Ticket {
    id: Int
    description: String
    thirdPartyId: String
    complexity: Int
    status: String
    tasks: [Task]
  }
  type Task {
    id: Int
    description: String
    estimatedTime: Int,
    realTime: Int,
    addedOnTheFly: Boolean,
    problems: [Problem]
  }
  input TaskInput {
    id: Int
    description: String
    estimatedTime: Int,
    realTime: Int,
    addedOnTheFly: Boolean,
    problems: [ProblemInput],
  }
  type Problem {
    id: Int
    description: String
    problemCategory: ProblemCategory
  }
  input ProblemInput {
    id: Int
    description: String
    problemCategory: ProblemCategoryInput
  }
  type ProblemCategory {
    id: Int
    description: String
  }
  input ProblemCategoryInput {
    id: Int
    description: String
  }
  type ProblemCategoryWithCount {
    id: Int
    description: String
    count: Int
  }
  input ProjectInput {
    name: String
    thirdPartyId: String
  }
  input PaginationInput {
    limit: Int = 0
    offset: Int = 0
  }
  type Mutation {
    updateCurrentState(state: String!): Int,
    updateTask(task: TaskInput!): Task,
    selectProject(project: ProjectInput): Project,
    addProblemCategory(problemCategoryDescription: String): ProblemCategory,
  }
  type Subscription {
    state: String!
  }
`

const resolvers = {
  Query: {
    hello: (_, args, { user }) => `Hello ${user.fullName || 'World'}`,
    currentUser: (_, args, { user }) => user,
    problemCategories: () => ProblemCategory.findAll(),
    problemCategoriesWithCount: (_, args, { user }) => {
      const projectId = user.currentProject.id;
      return sequelize.query(
        SELECT_PROBLEM_CATEGORY_COUNT_QUERY,
        { replacements: [projectId], type: sequelize.QueryTypes.SELECT }
      )
    },
    ticket: (_, { ticketId }) => {
      return Ticket.findById(
        ticketId,
        {
          include: {
            model: Task,
            as: 'tasks',
            include: {
              model: Problem,
              as: 'problems',
              include: {
                model: ProblemCategory,
                as: 'problemCategory',
              }
            }
          }
        },
      );
    },
    tickets: (_, { pagination: { limit, offset } }, { user }) => {
      const project = user.get('currentProject');
      return Ticket.findAndCountAll({where: { projectId: project.id }, limit, offset });
    }
  },
  Mutation: {
    updateCurrentState: (_, { state }, { pubsub, user }) => {
      const channel = 'user#'+user.id;
      pubsub.publish(channel, { state });


      jsState = JSON.parse(state);

      if (JSON.parse(user.state) && JSON.parse(user.state).currentStep === 'WORKFLOW' && jsState.currentStep === 'RESULTS') {
        console.log('here')
        const project = user.get('currentProject');
        saveSessionToSkillpool(project, user, jsState);
        const formattedTicket = formatFullTicket(jsState, project, user);
        upsert(Ticket, formattedTicket, {thirdPartyId: formattedTicket.thirdPartyId})
          .then(ticket => {
            Task.destroy({ where: { ticketId: ticket.id}});
            const formattedTasks = formatTasks(jsState, ticket);
            formattedTasks.map((formattedTask) =>
              Task.create(formattedTask)
                .then(task => {
                  formattedTask.problems.map(formattedProblem => {
                    formattedProblem.taskId = task.id;
                    Problem.create(formattedProblem)
                      .then(problem => formattedProblem.problemCategory && problem.setProblemCategory(formattedProblem.problemCategory.id))
                      .then(problem => problem.save());
                  })
                })
            );
          });
      }

      user.set('state', state);
      user.save();
      return 1;
    },
    updateTask: (_, { task }) => {
      return Task.findById(task.id, {include: [ { model: Problem, as: "problems"} ]}).then(taskToUpdate => {
        taskToUpdate.update(task).then(() => {
          Problem.destroy({ where: { taskId: taskToUpdate.id}}).then(() => {
            task.problems.map(formattedProblem => {
              formattedProblem.taskId = taskToUpdate.id;
              Problem.create(formattedProblem)
              .then(problem => formattedProblem.problemCategory && problem.setProblemCategory(formattedProblem.problemCategory.id))
              .then(problem => problem.save());
            })
          });
        });
      });
    },
    selectProject: (_, { project }, { user }) => {
      project.thirdPartyType = 'TRELLO';
      return Project.findOrCreate({
        where: {thirdPartyId: project.thirdPartyId},
        defaults: {...project}
      })
      .spread((project) => {
        user.setCurrentProject(project.id);
        return project;
      });
    },
    addProblemCategory: (_, { problemCategoryDescription }, { user }) => {
      return ProblemCategory.create({
        description: problemCategoryDescription,
      });
    },
  },
  Subscription: {
    state: {
      subscribe: (_, args, { user }) => {
        const channel = 'user#' + user.id;
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

const pubsub = new PubSub()
const context = async ({ request, connection }) => ({
  user: request ? request.user : connection ? connection.context.user : undefined,
  pubsub,
});
const server = new GraphQLServer({ typeDefs, resolvers, context })
server.express.post(server.options.endpoint, bodyParser.json(), authenticationMiddleware)

const serverOptions = isDev ?
  {subscriptions : {onConnect: websocketAuthenticationMiddleware}} :
  {
  https:{
    cert: fs.readFileSync('/etc/letsencrypt/live/caspr.theo.do/cert.pem','utf8'),
    key: fs.readFileSync('/etc/letsencrypt/live/caspr.theo.do/privkey.pem','utf8'),
  },
  subscriptions : {onConnect: websocketAuthenticationMiddleware}}

server.express.post(`/login`, bodyParser.json(), loginRoute)
server.start(serverOptions,() => console.log('Server is running on localhost:4000'))
