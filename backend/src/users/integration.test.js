const { startTestServer, launchAPIServer, mockAuthenticationMiddleware } = require('../testUtils');
const { toPromise } = require('apollo-link');
const gql = require('graphql-tag');

jest.mock('./dao'); // Mock database
jest.mock('../auth'); // Mock Authentication middlewares (necessary for this file as we test the auth middlewares)
const db = require('./dao');
const auth = require('../auth');

const HELLO = gql`
  {
    hello
  }
`;

const userMock = {
  id: '1',
  fullName: 'John Doe',
  trelloId: 'TRELLO_ID',
  currentProject: {
    id: 1,
  },
};

describe('API User Tests', () => {
  let graphql, httpServer;

  beforeEach(async () => {
    const testServer = await startTestServer();
    graphql = testServer.graphql;
  });

  afterEach(async () => {
    await httpServer.close();
  });

  it('should print hello user', async () => {
    mockAuthenticationMiddleware(userMock);
    httpServer = await launchAPIServer();
    const res = await toPromise(
      graphql({
        query: HELLO,
      }),
    );
    expect(res.data).toEqual({ hello: 'Hello ' + userMock.fullName });
  });

  it('should reject the user in the middleware', async () => {
    auth.authenticationMiddleware.mockImplementation((req, res) =>
      res.status(403).send({ error: 'unauthorized' }),
    );
    httpServer = await launchAPIServer();
    expect.assertions(1);
    try {
      await toPromise(graphql({ query: HELLO }));
    } catch (error) {
      expect(error.response.status).toEqual(403);
    }
  });

  it('should reject the user because he was not found in db', async () => {
    auth.verifyJWTToken = jest.fn((token, callback) => callback(null, { trelloId: 9999 }));
    db.findUser.mockImplementation(() => Promise.resolve(null));
    httpServer = await launchAPIServer();
    try {
      await toPromise(graphql({ query: HELLO }));
    } catch (error) {
      expect(error.response.status).toEqual(403);
    }
  });
});
