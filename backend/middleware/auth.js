const User = require('../models/User'); // <-- Make sure this import is present

const authenticate = async (req, res, next) => {
    try {
        const userId = req.header('userId');
        if (!userId) {
            return res.status(401).json({ error: 'No userId in header' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Invalid userId' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authenticate; // <-- Ensure this line is present
