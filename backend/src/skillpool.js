const https = require('https');
const axios = require('axios');

const isDev = process.env.ENV && process.env.ENV === 'DEV';

const client = axios.create({
  baseURL: isDev ? 'https://api.skillpool.theo.do/' : 'https://10.0.246.2/',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

const getOrCreateProject = async (project) => {
  let skillpoolProject;
  const { data: getProjectData } = await client.get('/projects', {
    params: { trelloId: project.thirdPartyId },
  });
  if (getProjectData['hydra:totalItems'] < 1) {
    const { data: postProjectData } = await client.post('/projects',
      { name: project.name, trelloId: project.thirdPartyId }
    );
    skillpoolProject = postProjectData;
  } else {
    skillpoolProject = getProjectData['hydra:member'][0];
  }
  return skillpoolProject;
}

const mockSkillpoolUser = {
  '@id': "/users/2",
  id: "2",
  trelloId: null,
  givenName: "Maxime",
  familyName: "Thoonsen",
};

const getOrCreateTicket = async (project, user, ticket) => {
  let skillpoolTicket;
  const { data: getTicketData } = await client.get('/tickets', {
    params: { trelloId: ticket.id },
  });
  if (getTicketData['hydra:totalItems'] < 1) {
    const { data: postTicketData } = await client.post('/tickets', {
      name: ticket.name,
      trelloId: ticket.id,
      user: user['@id'],
      project: project['@id'],
    });
    skillpoolTicket = postTicketData;
  } else {
    skillpoolTicket = getTicketData['hydra:member'][0];
  }
  return skillpoolTicket;
};

const extractTicketFromState = (state) => {
  const { currentTrelloCard: { id, name } } = state;

  return {id, name}
};

const createTasks = async (ticket, tasks) => {
  const formattedTasks = tasks.map(task => ({
    description: task.label,
    estimatedDuration: task.estimatedTime || 0,
    realDuration: task.realTime || 0,
    ticket: ticket['@id'],
    problemDescription: task.problems || "",
    trelloId: 'toto',
  }));
  Promise.all(formattedTasks.map(task =>
    client.post('/tasks', task)
  ))
};

const saveSessionToSkillpool = async (project, user, state) => {
  try {
    const skillpoolProject = await getOrCreateProject(project);
    const ticket = extractTicketFromState(state);
    const skillpoolTicket = await getOrCreateTicket(skillpoolProject, mockSkillpoolUser, ticket);
    createTasks(skillpoolTicket, state.tasks);
  } catch (error) {
    console.error(error);
  }
};
/*
try {
  const project = {name: 'test2', thirdPartyId: 'test2'};
  const state = {
    currentTrelloCard: {name: 'test2', id: 'test2'},
    tasks: [
      { id: 'aab6e43d-ac0c-46d3-88fd-b04671ed425f',
          label: 'Planning',
          realTime: 216443 },
      { id: 'fc0088fe-1714-4045-9e34-485694933d0e',
        label: 'tache 1 : ecrire composant react',
        problems: 'mes problèmes',
        estimatedTime: 360000,
        realTime: 370000 },
      { id: 'fc0088fe-1714-4045-9e34-485694933d0e',
        label: 'tache 2 : ecrire test react',
        realTime: 370000 }
    ],
  };
  saveSessionToSkillpool(project, null, state);
} catch (error) {
  console.error(error);
}
*/

module.exports = { saveSessionToSkillpool }
