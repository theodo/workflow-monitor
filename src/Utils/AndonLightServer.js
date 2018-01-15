import uuid from 'uuid';

export const sendColor = (color) => {
  fetch(`http://localhost:48017/${color}?refresh?${uuid()}`)
    .then(()=>{})
    .catch(()=>{});
};
