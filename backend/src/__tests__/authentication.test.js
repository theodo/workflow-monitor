const { startTestServer, launchAPIServer } = require('./__utils');
const jwt = require('jsonwebtoken');
const { toPromise } = require('apollo-link');
const { db } = require('../');
const gql = require('graphql-tag');

const HELLO = gql`
  {
    hello
  }
`;

const userMock = {
  id: '3',
  fullName: 'John Doe',
  trelloId: 'TRELLO_ID',
  currentProject: {
    id: 1,
  },
};

const headers = {
  Authentication:
    'Bearer ' + jwt.sign({ id: userMock.id, trelloId: userMock.trelloId }, 'JWT_SECRET'),
};

describe('API Authentication Tests', () => {
  let graphql, httpServer;

  beforeAll(async done => {
    httpServer = await launchAPIServer();
    db.findUser = jest.fn(() => Promise.resolve(userMock));
    done();
  });

  afterAll(async done => {
    await httpServer.close();
    done();
  });

  it('should authenticate the user by token', async () => {
    const testServer = await startTestServer(headers);
    graphql = testServer.graphql;

    const res = await toPromise(
      graphql({
        query: HELLO,
      }),
    );

    expect(res.data).toEqual({ hello: 'Hello ' + userMock.fullName });
  });

  it('should reject the user because missing token', async () => {
    const testServer = await startTestServer();
    graphql = testServer.graphql;
    try {
      await toPromise(
        graphql({
          query: HELLO,
        }),
      );
    } catch (error) {
      expect(error.response.status).toEqual(405);
    }
  });

  it('should reject the user because of invalid token', async () => {
    const testServer = await startTestServer({ Authentication: 'Invalid Token' });
    graphql = testServer.graphql;
    try {
      await toPromise(
        graphql({
          query: HELLO,
        }),
      );
    } catch (error) {
      expect(error.response.status).toEqual(405);
    }
  });

  it('should reject the user because he was not found in db', async () => {
    db.findUser = jest.fn(() => Promise.resolve(null));
    const testServer = await startTestServer(headers);
    graphql = testServer.graphql;
    try {
      await toPromise(
        graphql({
          query: HELLO,
        }),
      );
    } catch (error) {
      expect(error.response.status).toEqual(405);
    }
  });
});
