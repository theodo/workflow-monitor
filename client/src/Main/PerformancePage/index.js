import React from 'react';
import { Query } from 'react-apollo';
import dayjs from 'dayjs';
import { GET_DAILY_PERFORMANCE_HISTORY } from 'Queries/Tickets';
import PerformancePage from './view';

const startDate = dayjs().subtract(6, 'day');
const endDate = startDate.add(7, 'day');

const SHORT_WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const isWorkingDay = date => date.day() !== 0 && date.day() !== 6;

const formatDayLabel = weekDay =>
  `${SHORT_WEEK_DAYS[weekDay.day() - 1]} - ${weekDay.month() + 1}/${weekDay.date()}`;

const getDayFailures = (weekDay, performanceHistory) => {
  for (let i = 0; i < performanceHistory.length; i++) {
    if (dayjs(performanceHistory[i].creationDay).isSame(weekDay, 'day')) {
      return performanceHistory[i].failedTicketsCount;
    }
  }
  return 0;
};

const getPerformanceData = performanceHistory => {
  const orderedWeekDays = [];
  const daysLabel = [];
  const failuresCountData = [];

  for (let i = 0; i < 7; i++) {
    const weekDay = startDate.add(i, 'day');
    if (isWorkingDay(weekDay)) {
      orderedWeekDays.push(weekDay);
    }
  }

  orderedWeekDays.forEach(weekDay => {
    daysLabel.push(formatDayLabel(weekDay));

    const weekDayFailures = getDayFailures(weekDay, performanceHistory);

    failuresCountData.push(weekDayFailures);
  });

  return { daysLabel, failuresCountData };
};

const PerformancePageContainer = () => (
  <Query
    query={GET_DAILY_PERFORMANCE_HISTORY}
    variables={{
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return 'Unexpected error';

      const performanceData = getPerformanceData(data.dailyPerformanceHistory);
      return <PerformancePage chartInput={performanceData} />;
    }}
  </Query>
);

export default PerformancePageContainer;
