const axios = require("axios");

const url = 'http://0.0.0.0:4000/migrations';
let request_body = JSON.stringify({
  action: 'migrate'
});
if (process.argv[2] && process.argv[2]==='down') {
  request_body = JSON.stringify({
    action: 'down'
  });
}



// ************* SEND THE REQUEST *************

console.log('Sending migration request...');

axios.post(url, request_body).then(function (response) {
  console.log('Done');
  console.log(response.data);
})
.catch(function (error) {
  console.log(error);
});
