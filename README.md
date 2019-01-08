# Caspr

The ultimate lean digital tool to develop faster and better.

# How to develop

Run `npm install` in client and backend folders.

Run `docker-compose up`.

You're all set! Go to http://localhost to access to Caspr.

# Run migrations

Add `sequelize.sync({force:true});` at the end of `sequelize.js`file. Server should restart automatically and will run migrations.
