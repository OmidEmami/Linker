import FileHolder from "../Models/FileHolder.js";
export const fileUploader = async (req, res) => {
    try {
        const reserveId = req.body.reserveId;
        const newFile = new FileHolder({
            file: req.file.buffer,
            reserveId: reserveId,
        });
        await newFile.save();

        res.status(201).send('file uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};