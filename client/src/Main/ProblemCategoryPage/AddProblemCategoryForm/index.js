import React, { Component } from 'react';
import AddProblemCategoryForm from './view';
import { PROBLEM_LEAN_CATEGORY_VALUES } from './constants';

export const computeFullProblemCategoryDescription = (category, description) =>
  `${PROBLEM_LEAN_CATEGORY_VALUES[category]} / ${description}`;

class AddProblemCategoryFormContainer extends Component {
  state = {
    category: '',
    description: '',
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleAddProblemCategory = () => {
    this.props.addProblemCategory(
      computeFullProblemCategoryDescription(this.state.category, this.state.description),
    );
    this.setState({
      category: '',
      description: '',
    });
  };
  render() {
    return (
      <AddProblemCategoryForm
        category={this.state.category}
        description={this.state.description}
        handleChange={this.handleChange}
        handleAddProblemCategory={this.handleAddProblemCategory}
      />
    );
  }
}

export default AddProblemCategoryFormContainer;
