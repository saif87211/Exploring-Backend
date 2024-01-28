const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const movies = require('./routes/movies');
const home = require('./routes/home');
const logger = require('./logger');
const authenticate = require('./authenticate');

const app = express();

console.log('app:' + app.get('env'));
console.log('NODE_ENV=  ' + process.env.NODE_ENV);


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));
app.use(helmet());
app.use('/api/movies', movies);
app.use('/', home);

//Configuration
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server Name: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

if (app.get('env') === "development") {
    startupDebugger('using morgan....');
    app.use(morgan('tiny'));
}

//Db Work
dbDebugger('Connected to db');

app.use(logger.log);
app.use(authenticate.authentication);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}....`));