const { server, serverOptions } = require('./server');

server.start(serverOptions, () => console.log('Server is running on localhost:4000'));
