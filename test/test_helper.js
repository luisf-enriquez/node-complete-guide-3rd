const mongoose = require('mongoose');

before(function(done){
    this.timeout(100000)
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    mongoose.connection.once('open', () => {
        console.log('Databse Online');
        done();
    })
    .on('error', (err) => {
        console.warn('Warning', err);
    })
});