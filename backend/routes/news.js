const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const router = express.Router();

const API_KEY = process.env.NEWS_API_KEY;

router.get('/', authenticate, async (req, res) => {
    try {
        const { query } = req.query;
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&pageSize=10`;

        const response = await axios.get(apiUrl);

        if (response.status !== 200 || response.data.status === "error") {
            throw new Error(response.data.message || 'Failed to fetch news');
        }

        req.user.searchHistory.push(query);
        await req.user.save();

        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/bookmark', authenticate, async (req, res) => {
    try {
        const { url, title, description, urlToImage } = req.body;

        const alreadyBookmarked = req.user.savedArticles.some(article => article.url === url);

        if (alreadyBookmarked) {
            return res.status(400).json({ success: false, message: "Already bookmarked" });
        }

        req.user.savedArticles.push({ url, title, description, urlToImage });
        await req.user.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/bookmarks', authenticate, async (req, res) => {
    try {
        res.json({ bookmarks: req.user.savedArticles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/search-history', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('searchHistory -_id');
        res.json({ searchHistory: user.searchHistory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
