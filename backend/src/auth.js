const https = require('https');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../models');

const verifyJWTToken = (token, callback) => {
  return jwt.verify(token, 'JWT_SECRET', callback);
};

const findUser = userTrelloId => {
  return sequelize.models.user.find({
    where: { trelloId: userTrelloId },
    include: [{ model: sequelize.models.project, as: 'currentProject' }],
  });
};

const authenticationMiddleware = (req, res, next) => {
  let authorization = req.headers.authentication;
  const bearerLength = 'Bearer '.length;
  if (authorization && authorization.length > bearerLength) {
    const token = authorization.slice(bearerLength);
    verifyJWTToken(token, (err, result) => {
      if (err) {
        console.error(result);
        res.status(405).send('{"error": "Not authorized!"}');
      } else {
        findUser(result.trelloId).then(user => {
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(405).send('{"error": "Not authorized!"}');
          }
        });
      }
    });
  }
};

const websocketAuthenticationMiddleware = async (
  connectionParams,
  webSocket,
) => {
  if (connectionParams.authToken) {
    return verifyJWTToken(connectionParams.authToken, (err, result) => {
      if (err) {
        console.error(result);
        res.status(405).send('{"error": "Not authorized!"}');
      } else {
        return findUser(result.trelloId).then(user => {
          if (user) {
            return {
              user: user,
            };
          } else {
            throw new Error('Missing auth token!');
          }
        });
      }
    });
  }

  throw new Error('Missing auth token!');
};

const loginRoute = (req, res) => {
  const trelloToken = req.body.trelloToken;
  const trelloKey = '0314242ee352e79b01e16d6c79a6dee9';
  https
    .get(
      `https://api.trello.com/1/members/me?key=${trelloKey}&token=${trelloToken}`,
      resp => {
        if (resp && resp.statusCode === 200) {
          let data = '';

          resp.on('data', chunk => {
            data += chunk;
          });

          resp.on('end', () => {
            const dataJson = JSON.parse(data);
            sequelize.models.user
              .findOrCreate({
                where: { trelloId: dataJson.id },
                defaults: { fullName: dataJson.fullName },
                include: [
                  { model: sequelize.models.project, as: 'currentProject' },
                ],
              })
              .spread((user, created) => {
                const loginView = {
                  user,
                  jwt: jwt.sign(
                    { id: user.id, trelloId: dataJson.id },
                    'JWT_SECRET',
                  ),
                };
                res.status(200).send(loginView);
              });
          });
        } else {
          console.error(`Got error too:`);
          res.status(405).send('{"error": "Not authorized!"}');
        }
      },
    )
    .on('error', e => {
      console.error(`Got error: ${e.message}`);
      res.status(405).send('{"error": "Not authorized!"}');
    });
};

module.exports = {
  authenticationMiddleware,
  loginRoute,
  websocketAuthenticationMiddleware,
};
