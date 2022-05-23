const express = require('express');
const morgan = require('morgan');
const { transactionRoutes, userRoutes } = require('./routes');

const app = express();

app.use(morgan('tiny'));
app.use(express.json({ limit: '10kb' }));

// ROUTES
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

module.exports = { app };
