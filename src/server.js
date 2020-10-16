const http = require('http');
const app = require('./app');
const config = require('../config/config');
const mongo = require('./services/mongodb');

const server = http.createServer(app);

(async () => {
    try {
        const log = await mongo.connectMongoDB();
        console.log(log);
        server.listen(process.env.PORT || config.server.puerto);
        console.log(`Server running on port ${config.server.puerto}`)
    } catch (error) {
       console.log(error) 
    }
})();


