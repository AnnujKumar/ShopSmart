const app = require('./app')
const port = process.env.PORT || 5000

// Connect to the database first
require('./database');

// Check if we're in a Vercel serverless environment
if (process.env.VERCEL) {
    // For serverless, export the app directly
    module.exports = app;
} else {
    // For traditional hosting, listen on port
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port.`);
    }
    
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});
