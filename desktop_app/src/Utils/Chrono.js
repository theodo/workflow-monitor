const getTimer = (chrono, dateLastPause) => {
  if (!chrono.dateLastStart) return 0;
  return dateLastPause
    ? chrono.elapsedTime + (dateLastPause - chrono.dateLastStart)
    : chrono.elapsedTime + (new Date().getTime() - chrono.dateLastStart);
};

module.exports = { getTimer };
