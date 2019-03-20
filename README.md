# Caspr

The ultimate lean digital tool to develop faster and better.

# How to develop

Run `npm install` in client and backend folders.

Run `docker-compose up`.

Run migrations : `node_modules/.bin/sequelize db:migrate --env=local`.

You're all set! Go to http://localhost to access to Caspr.

# Deployment

## Staging

Staging platform is accessible at https://caspr-staging.theo.do. Ask SSH access to be able to deploy.

### Deployment

Run `npm run deploy:staging`.


## Production
Production platform is accessible at https://caspr.theo.do. Ask SSH access to be able to deploy.

### Deployment

Run `npm run deploy:prod`.

# Migrations

The ORM we use is [sequelize](http://docs.sequelizejs.com). Follow following command to update the database.

## Create a new model

Run `node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string` with correct model name and model attributes. Then edit the generated files.

## Run migrations

Run `node_modules/.bin/sequelize db:migrate`.
