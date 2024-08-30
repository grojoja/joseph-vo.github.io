const express = require('express');
const axios = require('axios');
const qs = require('querystring');

const app = express();
const port = 8888;

const client_id = '391799f6be294d5fa8d9adc63eef9f64'; // Replace with your Spotify Client ID
const client_secret = '1aff7a93d583406486ce261ed327fa60'; // Replace with your Spotify Client Secret
let refresh_token = ''; // We'll update this after the first authorization flow
const redirect_uri = 'https://josephvo.xyz';
const scopes = 'user-read-currently-playing user-read-playback-state';
const auth_url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

// Function to get a new access token using the refresh token
async function getAccessToken() {
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
    return response.data.access_token;
}

// Function to exchange authorization code for access and refresh tokens
async function getTokensFromAuthorizationCode(code) {
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

    // Save the refresh token for future use
    refresh_token = response.data.refresh_token;
    return response.data.access_token;
}

// Function to fetch currently playing track
async function getCurrentlyPlayingTrack(access_token) {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    });
    return response.data;
}

// Endpoint to start the authorization process
app.get('/login', (req, res) => {
    res.redirect(auth_url);
});

// Endpoint to handle the callback from Spotify after authorization
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Authorization code not provided.');
    }

    try {
        const access_token = await getTokensFromAuthorizationCode(code);
        res.send('Authorization successful! You can now access the /currently-playing endpoint.');
    } catch (error) {
        console.error('Error exchanging authorization code:', error.response ? error.response.data : error.message);
        res.status(500).send('Error exchanging authorization code.');
    }
});

// Endpoint to serve the currently playing track
app.get('/currently-playing', async (req, res) => {
    try {
        const access_token = await getAccessToken();
        const trackData = await getCurrentlyPlayingTrack(access_token);

        if (trackData && trackData.is_playing) {
            res.json({
                track: trackData.item.name,
                artist: trackData.item.artists.map(artist => artist.name).join(', '),
                albumArt: trackData.item.album.images[0].url
            });
        } else {
            res.json({ message: 'No track currently playing.' });
        }
    } catch (error) {
        console.error('Error fetching currently playing track:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching currently playing track.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Visit the following URL to authorize the app: ${auth_url}`);
});
