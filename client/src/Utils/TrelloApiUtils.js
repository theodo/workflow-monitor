import { formatMilliSecondToTime } from './TimeUtils';

const RESULTS_CHECKLIST_LABEL = 'Workflow-monitor results';

const trelloAuthParams = {
  type: 'popup',
  name: 'Workflow Monitor',
  scope: {
    read: 'true',
    write: 'true',
  },
  expiration: 'never',
};

export const authenticateTrello = (interactive = false) => {
  return new Promise((resolve, reject) => {
    window.Trello.authorize({
      ...trelloAuthParams,
      interactive: interactive,
      success: resolve,
      error: reject,
    });
  });
};

export const getOrCreateResultsChecklist = cardId => {
  return new Promise(function(resolve) {
    window.Trello.get('/cards/' + cardId + '/checklists').then(function(checklists) {
      for (var k = 0; k < checklists.length; k++) {
        if (RESULTS_CHECKLIST_LABEL === checklists[k].name) {
          window.Trello.delete('/checklists/' + checklists[k].id);
        }
      }
      var checklist = {
        name: RESULTS_CHECKLIST_LABEL,
        idCard: cardId,
      };
      window.Trello.post('/checklists/', checklist).then(function(data) {
        resolve(data);
      });
    });
  });
};

export const saveResultsInTrello = (cardId, results) => {
  getOrCreateResultsChecklist(cardId).then(function(checklist) {
    const myPromise = (checklistId, checkItem) =>
      window.Trello.post('/checklists/' + checklist.id + '/checkItems', checkItem);

    results.reduce((p, task) => {
      var realTime = task.realTime ? ' (' + formatMilliSecondToTime(task.realTime) + ')' : '';
      var problems = task.problems && task.problems.length > 0 ? ' pb : ' + task.problems : '';
      var checkItem = {
        name: task.label + realTime + problems,
      };
      return p.then(() => myPromise(checklist.id, checkItem));
    }, Promise.resolve());
  });
};
