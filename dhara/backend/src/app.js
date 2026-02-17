const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const herbRoutes = require('./routes/herbRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const dietRoutes = require('./routes/dietRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/herbs', herbRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
