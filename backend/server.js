import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const HOSTNAME = process.env.HOSTNAME || 'localhost';  // ✅ 新增 HOSTNAME
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// 🔐 GitHub OAuth Token 交換
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

// 📝 儲存使用者設定為 config/config.json
app.post('/save-config', (req, res) => {
  const config = req.body;
  const configDir = path.join(process.cwd(), 'config');
  const configPath = path.join(configDir, 'config.json');

  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    res.status(200).json({ message: 'Config saved successfully' });
  } catch (err) {
    console.error('❌ Failed to save config.json:', err);
    res.status(500).json({ error: 'Failed to save config file' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Auth/config server running at http://${HOSTNAME}:${PORT}`);  // ✅ 修改為使用 env
});

// ▶️ 啟動定時任務
import('./schedule.js').then(() => {
  console.log('⏰ schedule.js loaded');
}).catch(err => {
  console.error('❌ Failed to load schedule.js:', err);
});
