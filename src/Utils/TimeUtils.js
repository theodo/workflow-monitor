export const formatMilliSecondToTime = (timeInMilliSecond) => {
  if(isNaN(timeInMilliSecond)) return '';
  if (timeInMilliSecond < 0) return '00:00:00';
  var date = new Date(timeInMilliSecond);
  var hh = date.getUTCHours();
  var mm = date.getUTCMinutes();
  var ss = date.getSeconds();
  // If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
  // if (hh > 12) {hh = hh % 12;}
  // These lines ensure you have two-digits
  if (hh < 10) {hh = '0'+hh;}
  if (mm < 10) {mm = '0'+mm;}
  if (ss < 10) {ss = '0'+ss;}
  // This formats your string to HH:MM:SS
  return hh+':'+mm+':'+ss;
};

export const parseMillisecondFromFormattedTime = (timeString) => {
  const splittedTimeString = timeString.split(':');
  if (splittedTimeString.length !== 3) {
    return NaN;
  }
  const [hh, mm, ss] = splittedTimeString;
  return 1000 * (60 * (60 * parseInt(hh, 10) + parseInt(mm, 10)) + parseInt(ss, 10));
};
