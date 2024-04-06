import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';
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
                // Handle the error or set a default value for Hours
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

    // Convert CSV to Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Split CSV into rows and each row into cells
    const rows = csv.split('\n').map(row => {
        return row.split(',').map(cell => {
            // Remove double quotes from each cell
            return cell.replace(/(^"|"$)/g, '');
        });
    });

    worksheet.addRows(rows);

    // Write Excel file to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers to tell the browser to download the file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=hamam-details.xlsx`);

    // Send the buffer
    res.send(buffer);
};


   
