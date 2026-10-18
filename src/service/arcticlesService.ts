import {readFile, writeFile } from './utils/files.js'
import {createId, ensureError, findById, NotFoundError, articlesFilePath, authorsFilePath } from './utils/files.js'
import { loadAuthorsAsync } from './authorsService.js'



export type Article = {
    id : string,
    title: string,
    content: string,
    authorId: string,
}

export type NewArticle = Partial<Article> & Pick<Article, 'title' | 'content' | 'authorId'>;


export async function loadArticlesAsync(filePath: string) : Promise<Article[]>{
    try{
            const articles= await readFile(filePath)

            if(!Array.isArray(articles)){
                throw new Error('Expected JSON array')
            }
            return articles;
    }catch(err){
        const error = ensureError(err);
        throw new Error(`could not load article: ${error.message}`) 
    }
}

export async function loadPaginatedArticlesAsync(
    filePath: string,
    page: number,
    limit: number
) : Promise<Article[]>{
    const article = await loadArticlesAsync(filePath);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return article.slice(startIndex, endIndex);
}

export async function saveArticlesAsync(filePath : string, article: Article[]) : Promise<void> {
    try {
        await writeFile(filePath,article);
    } catch(err) {
        const error = ensureError(err);
        throw new Error(`could not save article: ${error.message}`);
    }
}

export async function addArticleAsync(article: NewArticle) : Promise<Article> {
    try {
        const articles = await loadArticlesAsync(articlesFilePath);
        const authors = await loadAuthorsAsync(authorsFilePath);

        if(!findById(authors, article.authorId)){
            throw new NotFoundError('Author not found');
        }

        const newArticle: Article = {
            title: article.title,
            content: article.content,
            id: createId(),
            authorId: article.authorId
        }

       
        articles.push(newArticle);
        await saveArticlesAsync(articlesFilePath, articles)
        return newArticle;
    } catch(err) {
        if (err instanceof NotFoundError) {
            throw err;
        }
        const error = ensureError(err);
        throw new Error(`could not add article: ${error.message}`);
    }
}


export async function clearArticlesAsync(id: string) : Promise<boolean> {
    try{
        const articles = await loadArticlesAsync(articlesFilePath);
        const article = findById(articles, id);

        if(!article){
            throw new NotFoundError('Article not found')
        }


        const newArticles = articles.filter((article) =>{
            return article.id !== id;
        });

        await saveArticlesAsync(articlesFilePath, newArticles)
        return true;
    } catch(err) {
        if (err instanceof NotFoundError) {
            throw err;
        }
        const error = ensureError(err);
        throw new Error(`could not clear article: ${error.message}`);
    }
}