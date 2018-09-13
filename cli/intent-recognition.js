
const dialogflow = require('dialogflow');

const projectId = 'coder-6a027'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'lol';
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: './Coder-4f735872d811.json'
});

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const sendMessage = (message) => {

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode,
      },
    },
  };

  return sessionClient.detectIntent(request);
}

module.exports.sendMessage = sendMessage
