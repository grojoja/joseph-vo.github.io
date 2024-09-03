const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const client_id = '391799f6be294d5fa8d9adc63eef9f64';
const client_secret = '1aff7a93d583406486ce261ed327fa60';
let access_token = 'BQBlAAqr8gkEc-PtDtyvsAQv7gKLhIRO0ldlKi-kFqPHJC3IhkoePo6N8JEJObD6KkH-ypcVzZS7L9m4PRvsy_kScCc5tQgMnPaW3ZlA0uZsbw3dF8_SikUbaqSA1zE9LIdHDL-MbWw1_gtW4wiaO-5RuQ9qiWUBSBG54XkEhWUzGn1ovs6SfSFD82itWdWygOvOK35ulLwn0nk7FKiWFoGSDA';
let refresh_token = 'AQBQSGe_kKMCP--OeiMdi2XkutzHEwn7ManmiyZEs1hDDY-vR1FOy0TZS5p8sNlOWr6_FQ6kvZMptSU5vEDMdSSc2xKilbMtRXpg7SURFDT1d4T6pK5HN0EulcoZLabmORg';
const redirect_uri = 'https://josephvo.xyz/callback.html';
const scopes = 'user-read-currently-playing user-read-playback-state';
const auth_url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

// Use CORS middleware to allow requests from specific origins
app.use(cors({
    origin: 'https://josephvo.xyz' // Replace with your website's URL
}));

// Serve static files from the 'docs' directory
app.use(express.static(path.join(__dirname, 'docs')));

// Serve the main HTML file for the root URL ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Function to refresh the access token using the refresh token
async function getAccessToken() {
    try {
        const token_url = 'https://accounts.spotify.com/api/token';
        const response = await axios.post(token_url, qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            client_id: client_id,
            client_secret: client_secret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        access_token = response.data.access_token;
        console.log('New Access Token obtained:', access_token);
        return access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Function to fetch the currently playing track
async function getCurrentlyPlayingTrack() {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Access token expired, attempting to refresh...');
            await getAccessToken();
            return getCurrentlyPlayingTrack(); 
        } else {
            console.error('Error fetching currently playing track:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

// Endpoint to handle the callback from Spotify after authorization
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        console.error('Authorization code not provided.');
        return res.status(400).send('Authorization code not provided.');
    }

    try {
        const token_url = 'https://accounts.spotify.com/api/token';
        const response = await axios.post(token_url, qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri,
            client_id: client_id,
            client_secret: client_secret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
        console.log('Access Token obtained:', access_token);
        console.log('Refresh Token obtained:', refresh_token);

        res.send('Authorization successful! You can now access the /currently-playing endpoint.');
    } catch (error) {
        console.error('Error exchanging authorization code:', error.response ? error.response.data : error.message);
        res.status(500).send('Error exchanging authorization code.');
    }
});

// Endpoint to serve the currently playing track data to the front-end
app.get('/currently-playing', async (req, res) => {
    try {
        const trackData = await getCurrentlyPlayingTrack();
        res.json(trackData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching currently playing track.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Visit the following URL to authorize the app: ${auth_url}`);
});
