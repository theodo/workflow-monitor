import uuid from 'uuid';
import { formatMilliSecondToTime, parseTextMinutesFromMilliSeconds } from './TimeUtils';

export const formatStringToTasks = taskString => {
  const tasks = taskString
    .split(/\n/)
    .filter(line => line.length > 0)
    .map(taskDescription => {
      if (!taskDescription.match(/\([0-9]+\)$/))
        return { id: uuid(), description: taskDescription, problems: '' };
      const timeIndex = taskDescription.lastIndexOf('(');
      const estimatedTime =
        60 *
        1000 *
        parseInt(taskDescription.substring(timeIndex + 1, taskDescription.length - 1), 10);
      const estimatedTimeText = parseInt(
        taskDescription.substring(timeIndex + 1, taskDescription.length - 1),
        10,
      );
      return {
        id: uuid(),
        description: taskDescription.substr(0, timeIndex),
        problems: '',
        estimatedTime,
        estimatedTimeText,
      };
    });
  return tasks.length > 0 ? tasks : [];
};

export const getFirstList = (tasksList, defaultTasksList) => {
  if (!tasksList.defaultTasksList) {
    tasksList.tasks = formatedDefaultTasksList(defaultTasksList.defaultTasks);
    tasksList.defaultTasksList = defaultTasksList;
  }
  return tasksList;
};

export const formatedDefaultTasksList = list =>
  list.map(defaultTask => ({
    ...defaultTask,
    id: defaultTask.id,
    estimatedTimeText: parseTextMinutesFromMilliSeconds(defaultTask.estimatedTime),
  }));

export const formatDefaultTasksList = list =>
  list.map(defaultTask => {
    const { estimatedTime, description, check } = defaultTask;
    return { estimatedTime, description, check };
  });

export const getTotalTime = (results, timeType) => {
  return formatMilliSecondToTime(
    results
      .filter(({ label }) => label !== 'Planning')
      .map(result => result[timeType])
      .reduce((totalTime, time) => totalTime + time, 0),
  );
};

export const filterEmptyTasks = tasks =>
  tasks.filter(task => task.description && task.description.length > 0);
