const express = require('express');
const json = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const employeesRouter = require('./routes/user-routes.js');
const authRouter = require('./routes/auth-routes.js')
const projectRouter = require('./routes/project-routes.js')

//look for .env file and pull environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const corsOption = {credential:true, origin: process.env.URL || '*'};

app.use(cors(corsOption));
app.use(json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/employees',employeesRouter);
app.use('/api/auth',authRouter);
app.use('/api/projects',projectRouter);


/*assuming an express app is declared here*/

app.listen(PORT , () => {
    console.log('listening on port => ' + PORT);
})