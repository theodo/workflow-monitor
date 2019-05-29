import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { GET_PROBLEM_CATEGORIES_PARETO } from 'Queries/Categories';
import { formatMilliSecondToTime } from 'Utils/TimeUtils';
import { appColors } from 'ui';
import ProblemCategoryPage from './view';

class ProblemCategoryPageContainer extends Component {
  state = {
    startDate: null,
    endDate: null,
  };
  handleDateChange = (key, date) => {
    this.setState({
      ...this.state,
      [key]: date,
    });
  };
  render() {
    return (
      <Query
        query={GET_PROBLEM_CATEGORIES_PARETO}
        variables={this.state}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {
          if (loading) return 'Loading';
          if (error) return 'Unexpected error';
          return (
            <ProblemCategoryPageMutationContainer
              {...this.state}
              handleDateChange={this.handleDateChange}
              loading={loading}
              problemCategories={data.problemCategoriesWithPareto}
            />
          );
        }}
      </Query>
    );
  }
}

class ProblemCategoryPageMutationContainer extends Component {
  state = {
    loading: false,
  };
  render() {
    const { loading: loadingQuery, problemCategories, ...restProps } = this.props;
    const { loading: loadingMutation } = this.state;

    const causes = problemCategories.map(problemCategory => problemCategory.description);
    const overtime = problemCategories.map(
      problemCategory => problemCategory.overtime / (3600 * 1000), // overtime in hours
    );
    const occurencesByProblemCatgory = problemCategories.reduce((result, problemCategory) => {
      result[problemCategory.description] = problemCategory.count;
      return result;
    }, {});

    const chartOptions = {
      legend: { display: false },
      tooltips: {
        callbacks: {
          label: tooltipItem =>
            `Overtime: ${formatMilliSecondToTime(tooltipItem.xLabel * 1000 * 3600)}, ` +
            `Occurrences: ${occurencesByProblemCatgory[tooltipItem.yLabel]}`,
        },
      },
      scales: {
        xAxes: [
          {
            id: 'overtime',
            ticks: { fontSize: 14, beginAtZero: true, min: 0 },
            type: 'linear',
            scaleLabel: {
              display: true,
              labelString: 'Overtime in hours',
              fontSize: 14,
            },
          },
        ],
        yAxes: [
          {
            id: 'causes',
            gridLines: { display: false },
            ticks: { fontSize: 14 },
          },
        ],
      },
    };

    const chartData = {
      labels: causes,
      datasets: [
        {
          backgroundColor: appColors.softRed,
          data: overtime,
        },
      ],
    };

    return (
      <ProblemCategoryPage
        {...restProps}
        chartData={chartData}
        chartOptions={chartOptions}
        loading={loadingQuery || loadingMutation}
        occurencesByProblemCatgory={occurencesByProblemCatgory}
        problemCategories={problemCategories}
      />
    );
  }
}

export default ProblemCategoryPageContainer;
