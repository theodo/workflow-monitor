import React from 'react';
import Select from 'react-select';

const backlogAutocompleteStyle = {
  width: '80%',
  marginTop: '15px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const BacklogAutocomplete = ({lists, value, onChange}) => {
  const options = lists.map(list => ({value: list.id, label: list.name }));
  const selectedValue = options.find(object => object.value === value);

  return (
    <div style={backlogAutocompleteStyle}>
      <Select
        value={selectedValue}
        onChange={(object) => onChange(object.value)}
        options={options}
        placeholder="Select backlog list"
      />
    </div>
  );
};

export default BacklogAutocomplete;
