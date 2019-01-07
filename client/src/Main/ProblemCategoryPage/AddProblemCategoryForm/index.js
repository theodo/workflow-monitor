import React, { Component } from 'react';
import AddProblemCategoryForm from './design';

const computeFullProblemCategoryDescription = (category, description) => `${category} / ${description}`;

class AddProblemCategoryFormContainer extends Component {
  state = {
    category: '',
    description: '',
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleAddProblemCategory = () => {
    this.props.addProblemCategory(
      computeFullProblemCategoryDescription(this.state.category, this.state.description)
    );
  }
  render(){
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
