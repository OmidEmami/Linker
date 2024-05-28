import { google } from 'googleapis';
import { Parser } from 'json2csv';
import HamamReserveDetail from '../Models/HamamReserveDetail.js';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();
const writeFile = promisify(fs.writeFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export const uploadHamamDetailsToSheet = async (req, res) => {
    const rawData = await HamamReserveDetail.findAll();
    const data = rawData.map(entry => {
        const { Hours, createdAt, updatedAt, ...restData } = entry.get({ plain: true });
        return {
            ...restData,
            Hours: Hours ? JSON.parse(Hours).join(' ') : ''
        };
    });

    // Ensure headers are included by setting the headers option
    const json2csvParser = new Parser({ header: true });
    const csv = json2csvParser.parse(data);

    const tempFilePath = path.join(__dirname, 'temp-hamam-details.csv');
    await writeFile(tempFilePath, csv);

    const csvContent = fs.readFileSync(tempFilePath, 'utf8');
    const csvRows = csvContent.split('\n').map(row => row.split(','));

    const spreadsheetId = '18kIT0eJjYYJ5GnbaNohPiFAcOWVaPCCEqQODdzuLJo4';
    const range = 'Sheet1!A1';

    // Clear the sheet before uploading new data
    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
    });

    // Update the sheet with new data, including headers
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
            values: csvRows,
        },
    });

    res.send('Data uploaded to Google Sheets successfully!');
};
