import FileHolder from "../Models/FileHolder.js";
export const fileUploader = async (req, res) => {
    try {
        const reserveId = req.body.reserveId;
       console.log(req.file)
        const newFile = new FileHolder({
            file: req.file.buffer,
            ReserveId: reserveId,
            isConfirmed : "false",
            fileName: req.file.originalname, 
            fileType: req.file.mimetype,
            paidAmount : "null",
            transactionCode : "null"
        });
        await newFile.save();

        res.status(201).send('file uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};