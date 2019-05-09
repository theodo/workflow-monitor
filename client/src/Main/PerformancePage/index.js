import React from 'react';
import { Query } from 'react-apollo';
import dayjs from 'dayjs';
import { GET_DAILY_PERFORMANCE_HISTORY } from 'Queries/Tickets';
import PerformancePage from './view';

const DAYS_RANGE = 7;

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

const getPerformanceData = (performanceHistory, startDate) => {
  const orderedWeekDays = [];
  const daysLabel = [];
  const failuresCountData = [];

  for (let i = 0; i < DAYS_RANGE; i++) {
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

class PerformancePageContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      endDate: dayjs(),
    };
  }

  moveDaysForward = forwardDays => () => {
    this.setState(previousState => ({
      endDate: previousState.endDate.add(forwardDays, 'days'),
    }));
  };

  render() {
    return (
      <Query
        query={GET_DAILY_PERFORMANCE_HISTORY}
        variables={{
          startDate: this.state.endDate.subtract(DAYS_RANGE - 1, 'day').format('YYYY-MM-DD'),
          endDate: this.state.endDate.add(1, 'day').format('YYYY-MM-DD'), // add 1 day so that sql query includes endDate
        }}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return 'Unexpected error';

          const performanceData = getPerformanceData(
            data.dailyPerformanceHistory,
            this.state.endDate.subtract(DAYS_RANGE - 1, 'day'),
          );
          return (
            <PerformancePage
              chartInput={performanceData}
              disableNextWeekButton={this.state.endDate.isSame(dayjs(), 'day')}
              moveDaysForward={this.moveDaysForward}
            />
          );
        }}
      </Query>
    );
  }
}

export default PerformancePageContainer;
