import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';

const router = express.Router();

// CRUD: CREATE -> POST /api/posts
router.post('/', createPost);

// CRUD: READ ALL -> GET /api/posts
router.get('/', getAllPosts);

// CRUD: READ SINGLE -> GET /api/posts/:id
router.get('/:id', getPostById);

// CRUD: UPDATE -> PUT /api/posts/:id
router.put('/:id', updatePost);

// CRUD: DELETE -> DELETE /api/posts/:id
router.delete('/:id', deletePost);

export default router;
