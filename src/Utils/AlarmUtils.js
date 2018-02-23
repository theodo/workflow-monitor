import { sendColor } from './AndonLightServer';

export const initAlarm = (timeInMilliSecond, withSound = true) => {
  if (timeInMilliSecond && timeInMilliSecond > 0) {
    sendColor('green');
    return setTimeout(() => {
      if (withSound) {
        const audio = new Audio('alarm.mp3');
        audio.play();
      }
      sendColor('red');
    }, (timeInMilliSecond));
  }
};
