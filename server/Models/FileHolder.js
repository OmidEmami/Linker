import mongoose from 'mongoose';

const fileHolderSchema = new mongoose.Schema({
    ReserveId: { type: String },
    fileName: { type: String, default: 'default-file' }, 
    fileType: { type: String, default: 'application/octet-stream' },
    file: { type: Buffer },
    isConfirmed: { type: String },
    paidAmount: {type:String},
    transactionCode : {type : String}
});

const FileHolder = mongoose.model('FileHolder', fileHolderSchema);
export default FileHolder;
