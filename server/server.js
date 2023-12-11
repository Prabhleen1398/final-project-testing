
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const questionRoutes = require('./routes/questionRoute');
const answerRoutes = require('./routes/answerRoute');
const tagRoutes = require('./routes/tagRoute');
const utilRoutes = require('./routes/utilsRoute');
const searchRoutes = require('./routes/searchRoute');
const sessionRoutes = require('./routes/sessionRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
const port = 8000;

//middleware
app.use(cors({ 
    credentials: true, 
    origin: 'http://localhost:3000' }));

app.use(bodyParser.urlencoded({
    extended: true
  }));

  //   const secKey = crypto.randomBytes(32).toString('hex');
const secret = process.argv[2];

app.use(session({
    secret: `${secret}`,
    cookie: {
        httpOnly: true,
        sameSite: true,
        maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
  }));

app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  });



//routes
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/util', utilRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/users', userRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/fake_so');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Database connection error"));

db.on('connected', () => {
    console.log("Server open. Database instantiated");
});

process.on('SIGINT', () => {
    db.close().then(() => {
        console.log("Server closed. Database instance disconnected");
        process.exit(0);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
