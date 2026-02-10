const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/config');
const AppError = require('./utils/appError');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middleware
app.use(helmet());
if (config.env === 'development') {
    app.use(morgan('dev'));
}
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use(config.apiPrefix, apiRoutes);

// Serve Frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Landing Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// 404 Handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: config.env === 'development' ? err.stack : undefined
    });
});

module.exports = app;
