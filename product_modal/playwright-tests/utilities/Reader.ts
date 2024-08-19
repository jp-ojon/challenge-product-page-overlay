import { promises as fs } from 'fs'
import path from 'path'          

/**
 * Utility function to read a JSON file, default folder path "root folder of playwright project"/testdata
 * @param filename 
 * @returns 
 */
export async function readJSONTestData(filename: string) {
    try {
        // Construct the path to the testdata folder
        const filePath = path.resolve(__dirname, '../testdata', filename);
        
        // Read the file content
        const data = await fs.readFile(filePath, 'utf-8');
        
        // Parse and return the JSON content
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading test data from ${filename}:`, err);
        throw err; // Rethrow the error if any occurs
    }
}