import uuid from 'uuid';

export const sendColor = (color) => {
  fetch(`https://localhost:443/${color}?refresh?${uuid()}`)
    .then(()=>{})
    .catch(()=>{});
};
