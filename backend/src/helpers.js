const getAllocatedTimeFromPointsAndCelerity = (points, celerity, dailyDevelopmentTime) => {
  if (points === null) return null;
  if (!celerity || !dailyDevelopmentTime) return 0;

  return Math.round((points / celerity) * dailyDevelopmentTime);
};

module.exports = getAllocatedTimeFromPointsAndCelerity;
