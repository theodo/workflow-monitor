
let timeOverTimer;

export const initAlarm = (timeInMilliSecond, withSound = true) => {
  if (timeInMilliSecond && timeInMilliSecond > 0) {
    timeOverTimer = setTimeout(() => {
      if (withSound) {
        const audio = new Audio('alarm.mp3');
        audio.play();
      }
    }, (timeInMilliSecond));
  }
};

export const cancelAlarm = () => {
  clearTimeout(timeOverTimer);
};
