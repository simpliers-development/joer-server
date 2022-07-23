# Joer

### Common commands
- `npm start (app)` -- to start your app. (app can be any nx project in `/apps/` folder)
- `npm run build (app)` -- to build your app. (app can be any nx project in `/apps/` folder)
- `npm run test (app/lib)` -- to test your app. (app can be any nx project in `/apps/` folder, lib can be any nx lib in `/libs/` folder)
- `npm run test:watch (app)` -- same as `test` but in watch mode
- To test your code quality use `npm run eslint`, `npm run lint (app)`
- To check only affected in your branch code use `npm run affected:lint`, `npm run affected:test`
- To run migrations in dev or test db use `npm run migration-dev`, `npm run migration-test`
- To undo the last migration in dev or test db use `npm run migration-dev:undo`, `npm run migration-test:undo`
- To undo all migration and clean db use `npm run migration-dev:clean`, `npm run migration-test:clean`


### SERVER

###### Required
- Node.js version 14.x.x
- All processes of Postgresql should be stoped (for Windows at least)

#### Steps to run the first time
1. Clone `git clone git@github.com:simpliers-development/joer-server.git`
2. Create postgresql docker container `docker run --name joer-db -e POSTGRES_PASSWORD=admin -d -p 5432:5432 postgres`
3. Connect to created container `docker exec -it joer-db psql -U postgres`
4. Create dev database `CREATE DATABASE joer;`
5. Create test databse `CREATE DATABASE joer_test;`
6. Leave docker container `\q`
7. Install dependancies `npm ci`
8. Contact your system administrator to get .env file
9. Run migrations for dev and test `npm run migration-dev` and `npm run migration-test`
10. Run `npm start server`

## To run tests
10. Run `npm run test server`