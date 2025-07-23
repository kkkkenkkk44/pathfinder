// backend/server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.post('/auth/github/callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token } = tokenResponse.data;
    if (access_token) {
      return res.json({ access_token });
    } else {
      return res.status(500).json({ error: 'Failed to retrieve access token' });
    }
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return res.status(500).json({ error: 'OAuth token exchange failed' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Auth server running at http://localhost:${PORT}`);
});
