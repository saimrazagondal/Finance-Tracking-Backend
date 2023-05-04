const express = require('express');
const morgan = require('morgan');
const { transactionRoutes, userRoutes, authRoutes } = require('./routes');
const { globalErrorHandler } = require('./utils/globalErrorHandler');

const app = express();

app.use(morgan('tiny'));
app.use(express.json({ limit: '10kb' }));

// ROUTES
app.use('/api/transaction', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use(globalErrorHandler);

module.exports = { app };
