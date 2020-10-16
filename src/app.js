const express =  require('express');
const bodyParser = require('body-parser');

const app =  express();
const config =  require('../config/config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', config.server.corsOrigins);
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization, token_refresh');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
});

// Routes
app.use(require('./routes/routes'));

// Custom 404 route not found handler
app.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: 'The route does not exist',
    });
});

module.exports = app;