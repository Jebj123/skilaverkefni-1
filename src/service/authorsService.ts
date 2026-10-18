import {readFile, writeFile} from './utils/files.js'
import {createId, ensureError, findById, NotFoundError, authorsFilePath} from './utils/files.js'


export type Author = {
    id: string,
    name: string,
    email: string,
    bio?: string
}

export type NewAuthor = Partial<Author> & Pick<Author, 'name' | 'email' >;

export async function loadAuthorsAsync(filepath: string) : Promise<Author[]>{
    try{
        const authors = await readFile(filepath)
        
        if(!Array.isArray(authors)){
            throw new Error('expected JSON array')
        }
        return authors;
    }catch(err){
        const  error = ensureError(err);
        throw new Error(`could not load author: ${error.message}`)
    }
}

export async function loadPaginatedAuthorsAsync(
    filepath: string,
    page: number,
    limit: number
) : Promise<Author[]>{
    const author = await loadAuthorsAsync(filepath)

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return author.slice(startIndex, endIndex)
}

export async function saveAuthorsAsync(filepath: string, author: Author[]) : Promise<void>{
    try{
        await writeFile(filepath,author);

    }catch(err){
        if(err instanceof NotFoundError){
            throw err;
        }
        const error = ensureError(err);
        throw new Error(`could not save author: ${error.message}`)
    }
}

export async function addAuthorsAsync(author: NewAuthor) : Promise<Author>{
    try{
        const authors = await loadAuthorsAsync(authorsFilePath);
       
        const newAuthor: Author = {
            id: createId(),
            name: author.name,
            email: author.email,
            bio: author.bio
        }
        authors.push(newAuthor);
        await saveAuthorsAsync(authorsFilePath, authors)
        return newAuthor;
    } catch (err) {
    if (err instanceof NotFoundError) {
        throw err;
    }
        const error = ensureError(err);
        throw new Error(`could not add author: ${error.message}`);
}


}

export async function clearAuthorsAsync(id: string) : Promise<Boolean>{
    try{
        const authors= await loadAuthorsAsync(authorsFilePath);
        const author = findById(authors, id)

            if(!author){
                throw new NotFoundError('Author not found')
            }
            const newAuthors = authors.filter((author) => {
                return author.id !== id;
            })

            await saveAuthorsAsync(authorsFilePath, newAuthors);
            return true;

    } catch (err) {
    if (err instanceof NotFoundError) {
        throw err;
    }
        const error = ensureError(err);
        throw new Error(`could not clear author: ${error.message}`);
}

}