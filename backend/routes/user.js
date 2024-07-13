const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists. Please login.' });
        }
        
        const user = new User({ email, password, name }); 
        await user.save();
        
        res.json({ success: true, message: "User registered successfully", userId: user._id });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post('/login', async (req, res) => {  
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

            const passwordMatches = await bcrypt.compare(password, user.password);
            
            if (!passwordMatches) {
                console.log("Passwords do not match for email:", email);
                return res.status(400).json({ error: 'Invalid credentials' });
            }
    
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
            res.json({ success: true, userId: user._id, name: user.name, token });  
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    


module.exports = router;


