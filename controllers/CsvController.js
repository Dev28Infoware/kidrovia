const CsvApiService = require('../services/CsvApiService')
const csvService = new CsvApiService();
exports.uploadFile = async(req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    let name = req.file.originalname;
    let buffer = req.file.buffer;
    try {
        const result = await csvService.uploadFile(name, buffer);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error uploading file: ' + error.message);
    }
}

exports.downloadFile = async(req,res)=>{
    let name = req.query.fileName;
    // let buffer = req.file.buffer;
    try {
        const result = await csvService.downloadFile(name);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error uploading file: ' + error.message);
    }    
}