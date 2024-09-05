const menuService = require('../services/MenuService');

// Controller function to handle menu API request
exports.getMenuData = async function(req, res) {
    try {
        const menuData = await menuService.fetchMenuData();
        res.json(menuData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

