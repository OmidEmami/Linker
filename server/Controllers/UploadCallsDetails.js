import { google } from 'googleapis';
import DetailedCalls from '../Models/DetailedCalls.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS), // Ensure this path correctly points to your credentials file
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export const getReservesDetails = async (req, res) => {
    try {
        const rawData = await DetailedCalls.findAll();
        // Adding headers as the first row in the formattedData array
        const headers = [
            "Phone",
            "LastCall",
            "FullName",
            "CallId",
            "FirstCall",
            "RequestType",
            "BackGround",
            "Result",
            "customerSource",
            "RegUser",
            "Section",
            "RequestDateAcco",
            "AccoRequestType",
            "ActionEghamat",
            "ActionEghamatZarfiat",
            "OtherAccoTypes",
            "OtherguestRequestType",
        ];
        const formattedData = rawData.map(item => [
            item.Phone,
            item.LastCall,
            item.FullName,
            item.CallId,
            item.FirstCall,
            item.RequestType,
            item.BackGround,
            item.Result,
            item.customerSource,
            item.RegUser,
            item.Section,
            item.RequestDateAcco,
            item.AccoRequestType,
            item.ActionEghamat,
            item.ActionEghamatZarfiat,
            item.OtherAccoTypes,
            item.OtherguestRequestType,
        ]);

        // Prepend the headers to the data array
        formattedData.unshift(headers);

        const spreadsheetId = '1qznx68VYqekinpqJ3zUSi0Z_p--aC0o3E2bHsjd1KHw'; // Make sure this is your correct spreadsheet ID
        const range = 'Sheet1!A1'; // Adjust the range if needed

        const request = {
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: formattedData,
            },
        };

        const response = await sheets.spreadsheets.values.update(request);
        res.send({ message: 'Data uploaded and formatted in Google Sheets successfully!', response: response.data });
    } catch (err) {
        console.error('The API returned an error: ' + err);
        res.status(500).send({ error: 'Failed to upload data to Google Sheets', details: err.message });
    }
};

