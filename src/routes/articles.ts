import express, { Request, Response, NextFunction } from 'express';
import { articleIdSchema, articleSchema } from '../schemas/arcticlesSchema.js';
import { validate, validateParams } from '../middleware/validate.js';
import { addArticleAsync, Article, clearArticlesAsync, loadArticlesAsync, NewArticle } from '../service/arcticlesService.js';
import { articlesFilePath, findById, NotFoundError } from '../service/utils/files.js';

const router = express.Router();

/**
 * Gets all articles
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The articles as a JSON object
 */
router.get('/',  async (req: Request, res: Response, next: NextFunction) => {
    try{
      const articles = await loadArticlesAsync(articlesFilePath);
      res.status(200).json(articles)
    } catch(error){
      next(error)
    }
});

/**
 * Gets an article by their ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The article as a JSON object
 */
router.get(
  '/:id', validateParams(articleIdSchema),
  async (req: Request<{ id: string }>, res: Response<Article>, next: NextFunction) => {
    try {
      const {id} = req.params;

      const articles = await loadArticlesAsync(articlesFilePath)
      const article = findById(articles, id);

      if(!article){
        return next(new NotFoundError('Article not found'));
      }
      res.status(200).json(article);
    } catch(error){
      next(error)
    }
  });

/**
 * Creates an article
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The article as a JSON object
 */
router.post(
  '/',
  validate(articleSchema),
  async (req: Request, res: Response<Article>, next: NextFunction) => {
    try {
      const article = req.body as NewArticle
      const createdArticle = await addArticleAsync(article)
      res.status(201).json(createdArticle)
    } catch (error){
      next(error)
    }
  });

/**
 * Deletes an article by their ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The message as a JSON object
 */
router.delete(
  '/:id', validateParams(articleIdSchema),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const articles = await loadArticlesAsync(articlesFilePath)
    const article = findById(articles, id);
    if(!article) {
      return next(new NotFoundError('Article not found'));
    }
  try{
    await clearArticlesAsync(article.id);
    res.status(200).json({ message: 'Article deleted successfully' });

  } catch (error){
    next(error)
  }

  });




export default router;
