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
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import ImageIcon from '@mui/icons-material/Image';

const langLabels = { zh: '中文', en: 'English', jp: '日本語' };
const weekDayLabels = ['日', '一', '二', '三', '四', '五', '六'];

export default function SettingsReviewPanel() {
  const {
    newsConfig,
    promptConfig,
    githubToken,
    socialConfig,
    adConfig,
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
      social: socialConfig,
      ads: adConfig,
    };

    console.log('📤 發送到 n8n 的資料:', payload);

    try {
      // const response = await axios.post(
      //   'https://n8n-v2.avatarmedicine.xyz/webhook-test/config',
      //   payload
      // );
      const response2 = await axios.post(
        'http://localhost:4000/save-config',
        payload
      );
      alert('發送成功');
    } catch (err) {
      console.error('❌ 發送失敗:', err);
      alert('❌ 發送失敗，請查看 console');
    }
  };

  return (
    <Box p={2} sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        所有儲存設定預覽
      </Typography>

      {/* 📰 新聞設定 */}
      <Card variant="outlined" sx={{ mb: 3, overflowX: 'hidden' }}>
        <CardContent>
          <Typography variant="h6"><NewspaperIcon sx={{ mr: 1 }} />新聞來源設定</Typography>
          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2">關鍵字</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {(newsConfig?.keywords || []).map((kw, i) => (
              <Chip key={i} label={kw} />
            ))}
          </Box>

          <Typography variant="subtitle2">網址</Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {(newsConfig?.urls || []).map((url, i) => (
              <Chip key={i} label={url} color="primary" />
            ))}
          </Box>

          <Typography variant="body2">
            抓取頻率：{newsConfig?.frequency_type === 'weekly' ? '每週' : '每日'}
          </Typography>
          {newsConfig?.frequency_type === 'weekly' && (
            <Typography variant="body2">
              每週執行日：星期{weekDayLabels[newsConfig.frequency_day]}
            </Typography>
          )}
          <Typography variant="body2">抓取時間：{newsConfig?.frequency_hour || '--'}:00</Typography>
          <Typography variant="body2">GitHub Repo：{newsConfig?.repo || '尚未設定'}</Typography>
          <Typography variant="body2">網站名稱：{newsConfig?.site_name || '尚未設定'}</Typography>
          <Typography variant="body2">自訂網域：{newsConfig?.custom_domain || '未使用'}</Typography>
        </CardContent>
      </Card>

      {/* ✍️ Prompt 設定 */}
      <Card variant="outlined" sx={{ mb: 3, overflowX: 'hidden' }}>
        <CardContent>
          <Typography variant="h6"><EditNoteIcon sx={{ mr: 1 }} />Prompt 設定</Typography>
          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2">摘要 Prompt</Typography>
          <Grid container spacing={1} mb={2}>
            {promptConfig?.summary_prompt
              ? Object.entries(promptConfig.summary_prompt).map(([lang, val]) => (
                  <Grid item xs={12} key={lang}>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      <strong>{langLabels[lang] || lang}：</strong><br />{val}
                    </Typography>
                  </Grid>
                ))
              : <Chip label="尚未設定" />}
          </Grid>

          <Typography variant="subtitle2">SEO Prompt</Typography>
          <Grid container spacing={1} mb={2}>
            {promptConfig?.seo_prompt
              ? Object.entries(promptConfig.seo_prompt).map(([lang, val]) => (
                  <Grid item xs={12} key={lang}>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      <strong>{langLabels[lang] || lang}：</strong><br />{val}
                    </Typography>
                  </Grid>
                ))
              : <Chip label="尚未設定" />}
          </Grid>

          <Typography variant="subtitle2">圖片生成 Prompt</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 2 }}>
            {promptConfig?.image_prompt || '尚未設定'}
          </Typography>

          <Typography variant="subtitle2">社群發文 Prompts</Typography>
          <Grid container spacing={1}>
            {promptConfig?.platform_prompts
              ? Object.entries(promptConfig.platform_prompts)
                  .filter(([_, langs]) =>
                    Object.values(langs).some(prompt => prompt?.trim())
                  )
                  .flatMap(([platform, langs]) =>
                    Object.entries(langs)
                      .filter(([_, prompt]) => prompt?.trim())
                      .map(([lang, prompt], j) => (
                        <Grid item xs={12} key={`${platform}-${lang}-${j}`}>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            <strong>{platform} - {langLabels[lang] || lang}</strong><br />{prompt}
                          </Typography>
                        </Grid>
                      ))
                  )
              : <Grid item xs={12}><Chip label="尚未設定" /></Grid>}
          </Grid>
        </CardContent>
      </Card>

      {/* 📣 社群平台設定 */}
      <Card variant="outlined" sx={{ mb: 3, overflowX: 'hidden' }}>
        <CardContent>
          <Typography variant="h6"><ShareIcon sx={{ mr: 1 }} />社群平台設定</Typography>
          <Divider sx={{ my: 1 }} />

          <Box mb={2}>
            <Typography variant="subtitle2">發文排程</Typography>
            <Typography variant="body2">
              發文頻率：{socialConfig?.post_frequency_type === 'weekly' ? '每週' : '每日'}
            </Typography>
            {socialConfig?.post_frequency_type === 'weekly' && (
              <Typography variant="body2">
                發文星期：星期{weekDayLabels[socialConfig.post_frequency_day] || '？'}
              </Typography>
            )}
            <Typography variant="body2">
              發文時間：{socialConfig?.post_frequency_hour || '--'}:00
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {socialConfig && Object.keys(socialConfig).some(k => !k.startsWith('post_')) ? (
            Object.entries(socialConfig).filter(([key]) => !key.startsWith('post_')).map(([platform, fields]) => (
              <Box key={platform} mb={2}>
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                  {platform}
                </Typography>
                {Object.entries(fields).map(([field, value]) => (
                  <Typography
                    key={`${platform}-${field}`}
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2, wordBreak: 'break-word' }}
                  >
                    {field}: {value ? '✅ 已填寫' : '❌ 未填寫'}
                  </Typography>
                ))}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              尚未設定任何平台憑證
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* 📢 廣告設定 */}
      {adConfig && Array.isArray(adConfig) && adConfig.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6"><ImageIcon sx={{ mr: 1 }} />廣告設定</Typography>
            <Divider sx={{ my: 1 }} />

            {adConfig.map((ad, idx) => (
              <Box key={idx} mb={2}>
                <Typography variant="subtitle2" gutterBottom>第 {idx + 1} 則廣告</Typography>
                <Typography variant="body2">圖片：{ad.image || '未提供'}</Typography>
                <Typography variant="body2">連結：{ad.link || '未提供'}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Box textAlign="right" mt={3}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmitToN8N}>
          ✅ 送出設定到 n8n
        </Button>
      </Box>
    </Box>
  );
}
