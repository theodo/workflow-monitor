import uuid from 'uuid';
import { formatMilliSecondToTime } from './TimeUtils';

export const formatStringToTasks = (taskString) => {
  const tasks = taskString
    .split(/\n/)
    .filter((line) => line.length > 0)
    .map((taskLabel) => {
      if (!taskLabel.match(/\([0-9]+\)$/)) return { id: uuid(), label: taskLabel, problems: '' };
      const timeIndex = taskLabel.lastIndexOf('(');
      const estimatedTime = 60 * 1000 * parseInt(taskLabel.substring(timeIndex + 1, taskLabel.length - 1 ), 10);
      const estimatedTimeText = parseInt(taskLabel.substring(timeIndex + 1, taskLabel.length - 1 ), 10);
      return {
        id: uuid(),
        label: taskLabel.substr(0, timeIndex),
        problems: '',
        estimatedTime,
        estimatedTimeText,
      };
    });
  return tasks.length > 0 ? tasks : [];
};

export const getTotalTime = (results, timeType) => {
  return formatMilliSecondToTime(results
    .filter(({ label }) => label !== 'Planning')
    .map((result) => result[timeType])
    .reduce((totalTime, time) => totalTime + time, 0)
  );
};

export const filterEmptyTasks = (tasks) => tasks.filter(task => task.label && task.label.length > 0);
