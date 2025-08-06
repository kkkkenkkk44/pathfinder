import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });



const configPath = path.join(process.cwd(), 'config', 'config.json');
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;



let previousNewsCron = null;
let previousSocialCron = null;
let newsTask = null;
let socialTask = null;

// ⏰ 每 30 秒檢查一次 config
setInterval(() => {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);

    const currentNewsCron = config?.news?.cron;
    const currentSocialCron = config?.social?.post_cron;

    // 🔁 更新 News 任務
    if (currentNewsCron && currentNewsCron !== previousNewsCron) {
      if (newsTask) newsTask.stop();

      newsTask = cron.schedule(currentNewsCron, async () => {
        console.log('📰 Triggering news webhook');
        try {
          await axios.post(WEBHOOK_URL, {
            ...config,
          });
          console.log('✅ News webhook sent');
        } catch (err) {
          console.error('❌ News webhook failed:', err.message);
        }
      });

      console.log(`🔁 News cron updated to: ${currentNewsCron}`);
      previousNewsCron = currentNewsCron;
    }

    // // 🔁 更新 Social 任務
    // if (currentSocialCron && currentSocialCron !== previousSocialCron) {
    //   if (socialTask) socialTask.stop();

    //   socialTask = cron.schedule(currentSocialCron, async () => {
    //     console.log('📣 Triggering social webhook');
    //     try {
    //       await axios.post(WEBHOOK_URL, {
    //         ...config,
    //         source: 'social',
    //       });
    //       console.log('✅ Social webhook sent');
    //     } catch (err) {
    //       console.error('❌ Social webhook failed:', err.message);
    //     }
    //   });

    //   console.log(`🔁 Social cron updated to: ${currentSocialCron}`);
    //   previousSocialCron = currentSocialCron;
    // }

  } catch (err) {
    console.error('❌ Failed to read config.json:', err.message);
  }
}, 10 * 1000);
