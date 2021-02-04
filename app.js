//import express
const express = require('express');
// import mongoose
const mongoose = require('mongoose');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');


//allow env variables
require('dotenv').config();

//import routes
const user_routes = require('./routes/UserRoutes');
const category_routes = require('./routes/CategoryRoutes');
const book_routes = require('./routes/BookRoutes');

const app = express();

//middleware
app.use(morgan('dev'));//morgan will be running only in development
app.use(bodyParser.json());//Used to receive json objects which have sent by the client
app.use(cookieParser());//Used to save client credentials on cookie
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use('/api', user_routes);
app.use('/api', category_routes);
app.use('/api', book_routes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running at ${port}`);
})

//db connection
mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true}
)
    .then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});