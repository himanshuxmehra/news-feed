import { Request, Response } from 'express';
import { postRepo } from '../repositories/postRepo';
import { likeRepo } from '../repositories/likeRepo';
import { DbError } from '../utils/dbErrors';

export const createPost = async (req: Request, res: Response) => {
  const { content, mediaUrls, parentPostId } = req.body;
  if (!content) {
    console.log('content is required');
    return res.status(400).json({ error: 'Content is required' });
  }

  const post = await postRepo.create(
    content,
    req.user!.id,
    mediaUrls,
    parentPostId,
  );

  return res.status(201).json(post);
};

export const getPosts = async (req: Request, res: Response) => {
  const { sort = 'date', order = 'desc', page = '1', limit = '20' } = req.query;

  const posts = await postRepo.findPosts(
    sort as string,
    order as 'asc' | 'desc',
    parseInt(limit as string),
    parseInt(page as string),
  );

  return res.json(posts);
};

export const getPost = async (req: Request, res: Response) => {
  const post = await postRepo.findById(req.params.id);
  return res.json(post);
};

export const updatePost = async (req: Request, res: Response) => {
  const { content, mediaUrls } = req.body;
  if (!content) {
    console.log('content is required');
    return res.status(400).json({ error: 'Content is required' });
  }

  const post = await postRepo.findById(req.params.id);
  if (post?.author_id !== req.user!.id) {
    throw new DbError('Unauthorized', 403);
  }

  const updatedPost = await postRepo.update(req.params.id, content, mediaUrls);
  return res.json(updatedPost);
};

export const deletePost = async (req: Request, res: Response) => {
  const post = await postRepo.findById(req.params.id);
  if (post?.author_id !== req.user!.id) {
    console.log('Unauthorized');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await postRepo.delete(req.params.id);
  return res.json({ message: 'Post deleted successfully' });
};

export const searchPosts = async (req: Request, res: Response) => {
  const {
    q,
    sort = 'relevance',
    order = 'desc',
    page = '1',
    limit = '20',
  } = req.query;

  if (!q) {
    console.log('Search query is required');
    return res.status(400).json({ error: 'Search query is required' });
  }

  const posts = await postRepo.search(
    q as string,
    sort as string,
    order as 'asc' | 'desc',
    parseInt(limit as string),
    parseInt(page as string),
  );

  return res.json(posts);
};

export const likePost = async (req: Request, res: Response) => {
  await likeRepo.like(req.user!.id, req.params.id);
  return res.json({ message: 'Post liked successfully' });
};

export const unlikePost = async (req: Request, res: Response) => {
  await likeRepo.unlike(req.user!.id, req.params.id);
  return res.json({ message: 'Post unliked successfully' });
};
