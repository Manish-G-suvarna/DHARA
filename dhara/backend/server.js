const app = require('./src/app');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./src/config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
    // Sync models (in development, alter: true updates schema)
    sequelize.sync({ alter: true }).then(() => {
        console.log('✅ Database Synced');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    });
});
