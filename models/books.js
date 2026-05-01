import path from 'path'
import fs from "fs/promises";
import {v4 as uuidV4} from'uuid'

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

export async function findById(id) {
    try {
        const allUsers = await readJSON(path);

        const book = allBooks.find(book => book.bookId === id);

        return book === undefined ? null : book;
    } catch
        (error) {
        throw new Error(`Error reading or filtering data from file: ${error.message}`);
    }
}

export async function create(data){
    try {
        const newBook = {...data,id: uuidV4()};
        const allBooks = await readJSON(path);
        allBooks.push(newBook);

        return newBook;

    } catch
        (error) {
        throw new Error(`Error reading or filtering data from file: ${error.message}`);
    }
}

export async function update(id, userId, data){
    try {
        let book = await findById(id) ;
        if(!book){
            throw new TypeError('book not found');
        }
        if (book.userId !== userId){
            throw new TypeError('user not found');
        }

        book = {...data,}
        const allBooks = await readJSON(path);
        allBooks.filter(book=>book.bookId !== id)
        allBooks.push(book);

        return book;

    } catch
        (error) {
        throw new Error(`Error reading or filtering data from file: ${error.message}`);
    }
}
