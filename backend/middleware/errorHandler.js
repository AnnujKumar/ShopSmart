const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Default error message and status
  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let details = null;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized: Invalid or missing token';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden: You do not have permission to access this resource';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
    details = err.value;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate entry';
  }
  
  // Add more detailed error information in development
  const response = {
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  };
  
  // In development, include the stack trace and error details
  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
    response.error.details = details || err.message;
  }
  
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
