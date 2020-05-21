const express = require('express');
const app = express();
const morgan = require('morgan'); //Importing the package
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const gardenRoutes = require('./routes/garden'); //CRUD for gardendb

app.use(morgan('dev')); //Using the package, dev is the format.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/gardendb");
mongoose.connect('mongodb://localhost:27017/gardendb', {useNewUrlParser: true});

app.use((req, res, next) => {
    res.header('Access-Contol-Allow-Origin', '*');
	res.header('Access-Contol-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/garden', gardenRoutes);

//Here we handle the errors for the requests.
app.use((req, res, next) => {
    const error = new Error('Not Found');   //We are creating new error object, with not found.
    error.status = 404; //Here we are setting the error status code to 404.
    next(error);    //Here we are executing the next callback, to forward the error request, and passing the error.
});

//Here we will handle all kinds of errors.
app.use((error, req, res, next) => {
    res.status(error.status || 500);    //Here we are setting the status code from the error or 500.
    res.json({
        error: {
            message: error.message  //Here we are returning JSON data with a message.
        }
    })
});

module.exports = app;