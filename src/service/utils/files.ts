import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const articlesFilePath = path.join(
  __dirname,
  '../../data/articles.json'
);
export const authorsFilePath = path.join(__dirname, '../../data/authors.json');

/**
 * Reads a file and returns the data as a JSON object
 * @param filePath - The path to the file to read
 * @returns The data as a JSON object
 */
export const readFile = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('Failed to read file:' + filePath);
  }
};

/**
 * Writes data to a file
 * @param filePath - The path to the file to write to
 * @param data - The data to write to the file
 * @returns The data as a JSON object
 */
export const writeFile = async (filePath: string, data: any) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
    throw new Error('Failed to write file:' + filePath);
  }
};

export function findById<T extends { id: string}>(items: T[], id: string) : T | undefined {
  return items.find((item) => item.id === id);
}

export function createId(){
  return randomUUID();
}

export class NotFoundError extends Error{
  status = 404;
}

export function ensureError(value: unknown) : Error {
  if(value instanceof Error) return value;

  let stringified = '[Unable to stringify the thrown value]';
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new Error(`Unexpected error: ${stringified}`);
  return error;
}
