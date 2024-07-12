if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
// const expressLayouts = require('express-ejs-layouts');
// const indexRouter = require('./routes/index')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
// const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/ErrorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3000;

// connecting to DB
connectDB();

// app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use('/user', require('./routes/users'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/room', require('./routes/room'));
app.use('/record', require('./routes/record'));
app.use('/frame', require('./routes/frame'));



app.use(verifyJWT);

// Put all protected routes here

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')){
        res.json({"error": "404 Not Found"});
    } else {
        res.type('txt').send("404 Not found");
    }
})
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => console.log(`server up and running on port ${PORT}`));
});