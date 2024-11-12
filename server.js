require('dotenv').config(); // Load environment variables

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YOUTUBE_API_KEY; // API Key from environment variables

app.use(cors()); // Enable CORS for all routes
app.use(express.static('public')); // Serve static files (frontend)

app.get('/', (req, res) => {
    res.send('Welcome to the Music App!');
});

// Fetch music data from YouTube API
app.get('/api/music', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query, // Query from the frontend
                type: 'video',
                key: API_KEY,
                maxResults: 10,
            },
        });
        res.json(response.data.items); // Return YouTube search results
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching music data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
