import uuid from 'uuid';

export const formatStringToTasks = (taskString) => {
  const tasks = taskString
    .split(/\n/)
    .filter((line) => line.length > 0)
    .map((taskLabel) => {
      if (!taskLabel.match(/\([0-9]+\)$/)) return { id: uuid(), label: taskLabel };
      const timeIndex = taskLabel.lastIndexOf('(');
      return {
        id: uuid(),
        label: taskLabel.substr(0, timeIndex),
        estimatedTime: 60 * 1000 * parseInt(taskLabel.substring(timeIndex + 1, taskLabel.length - 1 ), 10),
      };
    });
  return tasks.length > 0 ? tasks : undefined;
};
