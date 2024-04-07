import { Parser } from 'json2csv';
import HamamReserveDetail from '../Models/HamamReserveDetail.js';

export const downloadHamamDetails = async (req, res) => {
    // Fetch data from your table
    const rawData = await HamamReserveDetail.findAll();

    // Convert Sequelize data to a simpler object format, handle special cases, and exclude createdAt and updatedAt
    const data = rawData.map(entry => {
        const plainData = entry.get({ plain: true });

        // Handle 'Hours' field assuming it's a JSON array stored as a string
        if (plainData.Hours) {
            try {
                // Parse the JSON array and join it to a string with a space as separator
                const hoursArray = JSON.parse(plainData.Hours);
                plainData.Hours = hoursArray.join(' '); // Join with a space, or change separator as needed
            } catch (error) {
                console.error('Error parsing hours:', error);
                plainData.Hours = ''; // Set a default value for Hours in case of error
            }
        }

        // Remove createdAt and updatedAt from the object
        delete plainData.createdAt;
        delete plainData.updatedAt;

        return plainData;
    });

    // Convert to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    // Set headers to tell the browser to download the file as CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=hamam-details.csv');

    // Send the CSV file
    res.send(csv);
};
