require('dotenv').config();

const express = require('express');
const app = express();

var authTest = require('./controllers/authcontroller');
var user = require('./controllers/usercontrollers');
var sequelize = require('./db');


sequelize.authenticate().then(async () => {
    console.log('DB CONNECTED');
    sequelize.sync();
})
.catch((e) => {
    console.log(e);
    console.log('Server Crashed, oops');
})

app.use(express.json());
app.use('/api/user', user);
app.use(require('./middleware/headers'));
//app.use(require('./middleware/validate-session'));
app.use('/user', authTest);


app.listen(4000, function(){
    console.log('App is listening on 4000')
});