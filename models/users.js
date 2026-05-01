import path from 'path'
import fs from 'fs/promises'

export function pathCreate(filename) {
    return path.resolve(process.cwd(), filename);
}

const path = pathCreate('data/users.json');

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

export async function findById(id) {
    try {
        const allUsers = await readJSON(path);

        const user = allUsers.find(user => user.id === id);

        return user === undefined ? null : user;
    } catch
        (error) {
        throw new Error(`Error reading or filtering data from file: ${error.message}`);
    }
}

