import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check / welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 Backend API is running successfully!',
    endpoints: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        logout: 'POST /api/users/logout',
        getAllUsers: 'GET /api/users',
      },
      posts: {
        createPost: 'POST /api/posts',
        getAllPosts: 'GET /api/posts',
        getPostById: 'GET /api/posts/:id',
        updatePost: 'PUT /api/posts/:id',
        deletePost: 'DELETE /api/posts/:id',
      },
    },
  });
});

// Mount application routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled application error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
