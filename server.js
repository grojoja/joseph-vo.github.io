const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Heroku or default to 3000

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
        access_token = response.data.access_token; // Update the access token with the new one
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
            // Access token might have expired, try refreshing it
            console.log('Access token expired, attempting to refresh...');
            await getAccessToken();
            return getCurrentlyPlayingTrack(); // Retry the request with the new access token
        } else {
            console.error('Error fetching currently playing track:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

// Endpoint to start the authorization process
app.get('/login', (req, res) => {
    res.redirect(auth_url);
});

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

        access_token = response.data.access_token; // Save the new access token
        refresh_token = response.data.refresh_token; // Save the new refresh token
        console.log('Access Token obtained:', access_token);
        console.log('Refresh Token obtained:', refresh_token);

        res.send('Authorization successful! You can now access the /currently-playing endpoint.');
    } catch (error) {
        console.error('Error exchanging authorization code:', error.response ? error.response.data : error.message);
        res.status(500).send('Error exchanging authorization code.');
    }
});

// Endpoint to serve the currently playing track
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000); 
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Example of how to use this in your currently-playing endpoint
app.get('/currently-playing', async (req, res) => {
    try {
        const trackData = await getCurrentlyPlayingTrack();

        if (trackData && trackData.is_playing) {
            const trackName = trackData.item.name;
            const artistName = trackData.item.artists.map(artist => artist.name).join(', ');
            const albumArt = trackData.item.album.images[0].url;
            const progress = trackData.progress_ms;
            const duration = trackData.item.duration_ms;

            res.json({
                track: trackName,
                artist: artistName,
                albumArt: albumArt,
                progress: formatTime(progress), // Current progress in mm:ss format
                duration: formatTime(duration), // Total duration in mm:ss format
                progressPercentage: Math.round((progress / duration) * 100), // Optional: percentage progress
            });
        } else {
            res.json({ message: 'No track currently playing.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching currently playing track.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Visit the following URL to authorize the app: ${auth_url}`);
});
