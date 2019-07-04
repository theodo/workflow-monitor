# Caspr

The ultimate lean digital tool to develop faster and better.

# How to develop

1. Run `npm install` in web-client and backend folders.

2. In `./backend` copy `.env-exemple` in `.env` and add your configuration.

    **Alternatively**, ask for the `.env` already well completed by a theoder. 

3. Run `docker-compose up` or `npm start` in the root folder.

4. In an other terminal, run migrations in the backend folder: `node_modules/.bin/sequelize db:migrate --env=local`.

    **Alternatively**, ask for a dump of the database and apply it :
    
    `psql --host=localhost --port=5432 --username=caspr --password --dbname=caspr < dump_name.sql
` 

You're all set! Go to [http://localhost](http://localhost) to access to Caspr.

## GraphiQL and GraphQL Playground

To use Graphql Playground, [visit this page](./docs/graphql_playground.md).

# Deployment

## Staging

Staging platform is accessible at https://caspr-staging.theo.do. Ask SSH access to be able to deploy.

To connect to the server, run `ssh ubuntu@caspr-staging.theo.do`

### Deployment

Run `npm run deploy:staging`.


## Production
Production platform is accessible at https://caspr.theo.do. Ask SSH access to be able to deploy.

To connect to the server, run `ssh ubuntu@caspr.theo.do`

### Deployment

Run `npm run deploy:prod`.

# Migrations

The ORM we use is [sequelize](http://docs.sequelizejs.com). Follow following command to update the database.

## Create a new model

Run `node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string` with correct model name and model attributes. Then edit the generated files.

## Run migrations

Run `node_modules/.bin/sequelize db:migrate`.

# Database
To connect to the database, run the following command:
- dev environnement : `docker-compose exec postgresql psql -U caspr`
- staging & prod : `psql -h localhost -U caspr caspr`

