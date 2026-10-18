import express, { Request, Response, NextFunction } from 'express';
import { authorIdSchema, authorSchema } from '../schemas/authorsSchema.js';
import { addAuthorsAsync, clearAuthorsAsync, loadAuthorsAsync, NewAuthor } from '../service/authorsService.js';
import { validate , validateParams} from '../middleware/validate.js';
import { articlesFilePath, authorsFilePath, findById, NotFoundError } from '../service/utils/files.js';
import { Article, loadArticlesAsync } from '../service/arcticlesService.js';
import { type Author } from '../service/authorsService.js';

const router = express.Router();

/**
 * Gets all authors
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The authors as a JSON object
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authors = await loadAuthorsAsync(authorsFilePath);
    res.status(200).json(authors)
  } catch(error){
    next(error);
  }

});

/**
 * Gets an author by their ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The author as a JSON object
 */
router.get(
  '/:id', validateParams(authorIdSchema),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try{
      const authors = await loadAuthorsAsync(authorsFilePath)
      const {id} = req.params;

      const author = findById(authors, id)

      if(!author){
        return next(new NotFoundError('Author not found'));
      }
        res.status(200).json(author)
    } catch(error) {
      next(error)
    }
  });

/**
 * Gets all articles by an author's ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The articles as a JSON object
 */
router.get(
  '/:id/articles', validateParams(authorIdSchema),
  async (req: Request<{ id: string}>, res: Response<Article[]>, next: NextFunction) => {
    try{
      const articles = await loadArticlesAsync(articlesFilePath)
      const authors = await loadAuthorsAsync(authorsFilePath)
      const {id} = req.params;
      

      const author = findById(authors, id)


      if(!author){
        return next(new NotFoundError('Author not found'));
      }

      const authorArticles = articles.filter((article) => article.authorId === id);
      res.status(200).json(authorArticles)

    } catch(error){
      next(error)
    }

  }
);

/**
 * Creates an author
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The author as a JSON object
 */
router.post(
  '/', validate(authorSchema),
  async (req: Request, res: Response<Author>, next: NextFunction) => {
    try{
      const author = req.body as NewAuthor
      const createAuthor = await addAuthorsAsync(author)
      res.status(201).json(createAuthor)
    } catch(error){
      next(error)
    }
  });

/**
 * Deletes an author by their ID
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The message as a JSON object
 */
router.delete(
  '/:id', validateParams(authorIdSchema),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const authors = await loadAuthorsAsync(authorsFilePath)
    const author = findById(authors, id)

    if(!author){
      return next(new NotFoundError('Author not found'));
    }
    try{
      await clearAuthorsAsync(author.id);
      res.status(200).json({ message: 'Author deleted successfully' });
    } catch(error){
      next(error)
    }
  });



export default router;
