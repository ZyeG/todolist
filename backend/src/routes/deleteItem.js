const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeItem(req.params.id);
    //res.sendStatus(200);
    res.status(200).json({ success: true });
};
