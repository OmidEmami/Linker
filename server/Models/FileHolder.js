import mongoose from 'mongoose';
const fileHolderSchema = new mongoose.Schema({
    ReserveId: { type: String},
    file: Buffer,
  });
const FileHolder = mongoose.model('FileHolder', fileHolderSchema);
export default FileHolder;