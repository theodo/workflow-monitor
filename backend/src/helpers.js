const getAllocatedTimeFromPointsAndCelerity = (points, celerity, dailyDevelopmentTime) => {
  if (!points || !celerity || !dailyDevelopmentTime) return 0;

  return Math.round((points / celerity) * dailyDevelopmentTime);
};

module.exports = getAllocatedTimeFromPointsAndCelerity;
