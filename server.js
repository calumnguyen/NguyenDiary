const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

//connect to DB
connectDB();


// Middlewares
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser(`${process.env.jwtSecret}`));

app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({limit: '200mb',extended: true}));


// Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Running on port: ${port}`));
