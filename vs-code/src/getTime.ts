// takes the total elapsed time and adds up the time since last start
// does it mean that the time is not updated until the task is stopped // paused ?
// dateLast start seems uneriable, it does not take the pause into account correctl
export const calculateCurrentTaskTime = (taskChrono: any) => {
    const now = (new Date()).getTime();

    return taskChrono.elapsedTime + (now - taskChrono.dateLastStart);
};

export const calculateElapsedTime = (chrono: any, dateLastPause: number) => {
    return chrono.elapsedTime + (dateLastPause - chrono.dateLastStart);
};
