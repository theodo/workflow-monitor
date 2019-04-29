import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { PROBLEM_LEAN_CATEGORY } from './constants';

const addCategoryFormStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  width: '100%',
};

const selectStyle = {
  minWidth: 200,
};

const noMargin = {
  margin: 0,
};

const positionInherit = {
  position: 'inherit',
};

const AddProblemCategoryForm = props => (
  <div>
    <h3>Add a problem category</h3>
    <p style={{ margin: '10px' }}>
      Before adding any category, please check that the category doesn't already exist and write it
      in English.
    </p>
    <FormControl style={addCategoryFormStyle} variant="outlined">
      <div style={positionInherit}>
        <InputLabel htmlFor="outlined-category-simple">Category</InputLabel>
        <Select
          style={selectStyle}
          value={props.category}
          onChange={props.handleChange}
          input={<OutlinedInput labelWidth={100} name="category" id="outlined-category-simple" />}
        >
          {Object.keys(PROBLEM_LEAN_CATEGORY).map(category => (
            <MenuItem key={category} value={category}>
              {PROBLEM_LEAN_CATEGORY[category]}
            </MenuItem>
          ))}
        </Select>
      </div>
      <TextField
        style={noMargin}
        id="outlined-description"
        label="Description"
        value={props.description}
        onChange={props.handleChange}
        name="description"
        margin="normal"
        variant="outlined"
      />
      <Button
        disabled={!props.category || !props.description}
        onClick={props.handleAddProblemCategory}
      >
        Add
      </Button>
    </FormControl>
  </div>
);

export default AddProblemCategoryForm;
