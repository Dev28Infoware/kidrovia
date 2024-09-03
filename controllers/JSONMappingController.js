const JSONMappingService = require('../services/JSONMappingService');
const jsonMappingService = new JSONMappingService();

exports.addMapping = async (req, res) => {
    try {
        const { key, values } = req.body;

        console.log(key, values);
        const result = await jsonMappingService.addMapping(key, values);
        res.json(result);
    } catch (error) {
        console.error(error.stack);
        res.status(500).send(error.message);
    }
};

exports.editMapping = async (req, res) => {
    try {
        const { key, oldValue, newValue } = req.body;
        const result = await jsonMappingService.editMapping(key, oldValue, newValue);
        res.json(result);
    } catch (error) {
        console.error(error.stack);
        res.status(500).send(error.message);
    }
};

exports.removeMapping = async (req, res) => {
    try {
        const { key, value } = req.body;
        const result = await jsonMappingService.removeMapping(key , value);
        res.json(result);
    } catch (error) {
        console.error(error.stack);
        res.status(500).send(error.message);
    }
};
