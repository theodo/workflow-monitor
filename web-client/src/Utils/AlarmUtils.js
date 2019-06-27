let timeOverTimer;

let audio;
// TODO: Refacto by removing this variable
let isAlarmMuted;

export const initAlarm = (timeInMilliSecond, withSound = true) => {
  if (timeInMilliSecond && timeInMilliSecond > 0) {
    timeOverTimer = setTimeout(() => {
      if (withSound) {
        audio = new Audio('alarm.mp3');
        audio.muted = isAlarmMuted;
        audio.play();
      }
    }, timeInMilliSecond);
  }
};

export const setMuted = isMuted => {
  isAlarmMuted = isMuted;
  if (audio) audio.muted = isMuted;
};

export const cancelAlarm = () => {
  clearTimeout(timeOverTimer);
};
