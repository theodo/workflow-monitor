import { sendColor } from './AndonLightServer';

const TIME_BEFORE_RED_LIGHT = 30000;

let redLightTimer;
let timeOverTimer;

let audio;
// TODO: Refacto by removing this variable
let isAlarmMuted;

export const initAlarm = (timeInMilliSecond, withSound = true) => {
  if (timeInMilliSecond && timeInMilliSecond > 0) {
    clearTimeout(redLightTimer);
    sendColor('green');
    timeOverTimer = setTimeout(() => {
      if (withSound) {
        audio = new Audio('alarm.mp3');
        audio.muted = isAlarmMuted;
        audio.play();
      }
      sendColor('orange');
      redLightTimer = setTimeout(() => {
        sendColor('red');
      }, (TIME_BEFORE_RED_LIGHT));
    }, (timeInMilliSecond));
  }
};

export const setMuted = (isMuted) => {
  isAlarmMuted = isMuted;
  if(audio) audio.muted = isMuted;
};

export const cancelAlarm = () => {
  clearTimeout(timeOverTimer);
  clearTimeout(redLightTimer);
};
