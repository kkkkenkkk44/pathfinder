import React, { useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const langLabels = { zh: '中文', en: 'English', ja: '日本語' };

export default function SettingsReviewPanel() {
  const {
    newsConfig,
    promptConfig,
    githubToken,
  } = useContext(AppContext);

  const handleSubmitToN8N = async () => {
    if (!githubToken || !newsConfig || !promptConfig) {
      alert('請先完成所有設定與登入 GitHub');
      return;
    }

    const payload = {
      news: newsConfig,
      prompt: promptConfig,
      github_token: githubToken,
    };

    console.log('📤 發送到 n8n 的資料:', payload);

    try {
      const response = await axios.post(
        'https://n8n-v2.avatarmedicine.xyz/webhook-test/2695e37b-3be2-4412-b2b0-cd491450b3b4',
        payload
      );
      alert('✅ 設定已成功送出');
      console.log('✅ n8n 回應:', response.data);
    } catch (err) {
      console.error('❌ 發送失敗:', err);
      alert('❌ 發送失敗，請查看 console');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        所有儲存設定預覽
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">📰 新聞來源設定</Typography>
          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2">關鍵字</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {(newsConfig?.keywords || ['尚未設定']).map((kw, i) => (
              <Chip key={i} label={kw} />
            ))}
          </Box>

          <Typography variant="subtitle2">網址</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {(newsConfig?.urls || ['尚未設定']).map((url, i) => (
              <Chip key={i} label={url} color="primary" />
            ))}
          </Box>

          <Typography variant="body2">
            頻率類型：{newsConfig?.frequency_type === 'weekly' ? '每週' : '每日'}
          </Typography>
          {newsConfig?.frequency_type === 'weekly' && (
            <Typography variant="body2">每週執行日：星期{newsConfig.frequency_day || '尚未設定'}</Typography>
          )}
          <Typography variant="body2">執行時間：{newsConfig?.frequency_hour || '--'}:00</Typography>
          <Typography variant="body2">GitHub Repo：{newsConfig?.repo || '尚未設定'}</Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">✍️ Prompt 設定</Typography>
          <Divider sx={{ my: 1 }} />

          {/* 摘要 Prompt */}
          <Typography variant="subtitle2">摘要 Prompt</Typography>
          <Grid container spacing={1} mb={2}>
            {promptConfig?.summary_prompt
              ? Object.entries(promptConfig.summary_prompt).map(([lang, val]) => (
                  <Grid item xs={12} key={lang}>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                      <strong>{langLabels[lang] || lang}：</strong><br />{val}
                    </Typography>
                  </Grid>
                ))
              : <Chip label="尚未設定" />
            }
          </Grid>

          {/* SEO Prompt */}
          <Typography variant="subtitle2">SEO Prompt</Typography>
          <Grid container spacing={1} mb={2}>
            {promptConfig?.seo_prompt
              ? Object.entries(promptConfig.seo_prompt).map(([lang, val]) => (
                  <Grid item xs={12} key={lang}>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                      <strong>{langLabels[lang] || lang}：</strong><br />{val}
                    </Typography>
                  </Grid>
                ))
              : <Chip label="尚未設定" />
            }
          </Grid>

          {/* 圖片生成 Prompt */}
          <Typography variant="subtitle2">圖片生成 Prompt</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
            {promptConfig?.image_prompt || '尚未設定'}
          </Typography>

          {/* 社群平台 Prompt */}
          <Typography variant="subtitle2">社群平台發文 Prompts</Typography>
          <Grid container spacing={1}>
            {promptConfig?.platform_prompts
              ? Object.entries(promptConfig.platform_prompts).flatMap(([platform, langs]) =>
                  Object.entries(langs).map(([langCode, prompt], j) => (
                    <Grid item key={`${platform}-${langCode}-${j}`} xs={12}>
                      <Chip label={`[${platform}][${langLabels[langCode] || langCode}] ${prompt}`} />
                    </Grid>
                  ))
                )
              : (
                <Grid item xs={12}>
                  <Chip label="尚未設定" />
                </Grid>
              )}
          </Grid>
        </CardContent>
      </Card>

      <Box textAlign="right" mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmitToN8N}>
          ✅ 送出設定到 n8n
        </Button>
      </Box>
    </Box>
  );
}
