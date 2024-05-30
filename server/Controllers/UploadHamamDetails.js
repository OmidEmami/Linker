import { google } from 'googleapis';
import HamamReserveDetail from '../Models/HamamReserveDetail.js';
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

export const uploadHamamDetailsToSheet = async (req, res) => {
    try {
        const rawData = await HamamReserveDetail.findAll();
        // Adding headers as the first row in the formattedData array
        const headers = [
            "UniqueId", "FullName", "Phone", "Date", "Hours", "CustomerType",
            "ServiceType", "SelectedService", "AccoStatus", "CateringDetails",
            "MassorNames", "SelectedMassorNames", "SelectedPackage", "Desc",
            "FinalPrice", "User", "CurrentStatus", "SatisfactionText", "Satisfaction"
        ];
        const formattedData = rawData.map(item => [
            item.UniqueId,
            item.FullName,
            item.Phone,
            item.Date,
            item.Hours,
            item.CustomerType,
            item.ServiceType,
            item.SelectedService,
            item.AccoStatus,
            item.CateringDetails,
            item.MassorNames,
            item.SelectedMassorNames,
            item.SelectedPackage,
            item.Desc,
            item.FinalPrice,
            item.User,
            item.CurrentStatus,
            item.SatisfactionText,
            item.Satisfaction
        ]);

        // Prepend the headers to the data array
        formattedData.unshift(headers);

        const spreadsheetId = '18kIT0eJjYYJ5GnbaNohPiFAcOWVaPCCEqQODdzuLJo4'; // Make sure this is your correct spreadsheet ID
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

