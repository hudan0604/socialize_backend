const express = require('express')
require('./mongoDB/mongoose')

// routes
const userRoutes = require('./routes/user.routes');

const cors = require('cors');

const app = express()
app.use(express.json());
app.use(userRoutes);

module.exports = app;

app.options('*', cors());
