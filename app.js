const express = require('express');
let router = express.Router();
const mongoose = require('mongoose');


let app = express();
let routes = require('./routes/index.js');

app.use('/',routes);

mongoose.connect('mongodb://localhost/omniconnect');
let connection = mongoose.connection;
//handle mongodb error
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("Connected to DataBase...");
});

app.use((err, req, res, next) => {
  res.status(500).send({
    "Error": err.stack
  });
});

app.set('port', process.env.PORT || 4000 );
app.listen(app.get('port') , function(){
console.log('Server started on port : '+ app.get('port'));
});

module.exports = router;