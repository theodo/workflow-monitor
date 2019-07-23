const axios = require("axios");

const url = 'http://0.0.0.0:4000/migrations';
const request_body = JSON.stringify({});



// ************* SEND THE REQUEST *************

console.log('Sending migration request...');

axios.post(url, request_body).then(function (response) {
  console.log('Done');
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});
