const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require("./models");

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const authMiddleware = require('./middleware/auth')

const app = express();
db.sequelize.sync({force:false, logging: console.log});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authMiddleware)

app.use('/', indexRouter);
app.use('/auth', authRouter);

module.exports = app;