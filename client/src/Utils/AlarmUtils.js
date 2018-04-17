import { sendColor } from './AndonLightServer';

const TIME_BEFORE_RED_LIGHT = 30000;

let redLightTimer;
let timeOverTimer;

export const initAlarm = (timeInMilliSecond, withSound = true) => {
  if (timeInMilliSecond && timeInMilliSecond > 0) {
    clearTimeout(redLightTimer);
    sendColor('green');
    timeOverTimer = setTimeout(() => {
      if (withSound) {
        const audio = new Audio('alarm.mp3');
        audio.play();
      }
      sendColor('orange');
      redLightTimer = setTimeout(() => {
        sendColor('red');
      }, (TIME_BEFORE_RED_LIGHT));
    }, (timeInMilliSecond));
  }
};

export const cancelAlarm = () => {
  clearTimeout(timeOverTimer);
  clearTimeout(redLightTimer);
};
