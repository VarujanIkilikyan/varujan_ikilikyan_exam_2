import path from 'path'
import fs from "fs/promises";

export function pathCreate(filename) {
    return path.resolve(process.cwd(), filename);
}

const path = pathCreate('data/books.json');

export async function readJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


export async function writeJsonFile(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonData, 'utf8');
    } catch (error) {
        throw new Error(`Error writing file: ${error.message}`);
    }
}

export  async  function findAll(userId, page, limit){
    const allBooks = await readJSON(path);
    const userBooks = allBooks.filter(book => book.userId === userId);
    const skip = (page - 1) * limit;

    return{ books: [...userBooks.slice(skip, skip + limit)], total: userBooks.length };

}