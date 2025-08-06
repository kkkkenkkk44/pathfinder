import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { AppContext } from '../../context/AppContext';
import { JoinFull } from '@mui/icons-material';

const platforms = ['Facebook', 'Threads', 'Instagram', 'X'];
const languages = [
  { label: '中文', code: 'zh' },
  { label: 'English', code: 'en' },
  { label: '日本語', code: 'jp' },
];

export default function PromptPanel({ onSave }) {
  const { promptConfig, setPromptConfig } = useContext(AppContext);

  const [summaryPrompt, setSummaryPrompt] = useState(
    {
        zh: `是一位專業的 SEO 新聞摘要寫手，擅長將新聞內容濃縮成具故事感、親切易懂、同時包含關鍵字的短篇摘要。請用繁體中文撰寫，適合放在文章開頭、社群貼文或搜尋引擎預覽中，並以 HTML 格式輸出（使用 <p> 包裹段落）。`,
        en: `You are a professional SEO news summary writer. Your job is to distill news content into a short, engaging, and keyword-rich summary (300–500 words) in HTML format using <p> tags. The summary should be suitable for article previews, social posts, and search snippets.`, 
        jp: `あなたはプロのSEOニュース要約ライターです。ニュースをもとに、HTML形式（各段落を <p> タグで囲む）でストーリー性のある要約（300〜500字）を書いてください。記事プレビューや検索結果に適した形式です。`
    });
  const [seoPrompt, setSeoPrompt] = useState(
    {
        zh: `是一位專業的 SEO 新聞寫手，擅長將新聞內容改寫成結構清楚、語氣親切、有故事感又自然流暢的文章。請用繁體中文撰寫，適合一般大眾閱讀，並符合 SEO 寫作邏輯，文章需使用 HTML 格式產出。`,
        en: `You are a professional SEO news writer who excels at turning news content into clear, friendly, story-driven, and naturally fluent articles. Write in English for a general audience with an SEO-optimized structure in HTML. The final text must read like native-level news writing.`,
        jp: `なたはプロのSEOニュースライターです。ニュース内容を、構造的で親しみやすく、ストーリー性があり、自然で読みやすい日本語の記事に書き換えるのが得意です。日本語で執筆し、一般の読者向けにSEO構造を持つHTML形式で出力してください。` 
    });
  const [imagePrompt, setImagePrompt] = useState('請為這篇文章生成一張符合主題、具吸引力的圖片，風格需寫實，避免過度誇張。');
  const [platformTabs, setPlatformTabs] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState('Facebook');
  const [languageTab, setLanguageTab] = useState(0);
  const [seoTab, setSeoTab] = useState(0);

  useEffect(() => {
    if (promptConfig) {
      setSummaryPrompt(promptConfig.summary_prompt || { zh: '', en: '', jp: '' });
      setSeoPrompt(promptConfig.seo_prompt || { zh: '', en: '', jp: '' });
      setImagePrompt(promptConfig.image_prompt || '');
      setPlatformTabs(promptConfig.platform_prompts || {});
    }
  }, [promptConfig]);

  const handlePromptChange = (platform, language, value) => {
    setPlatformTabs((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [language]: value,
      },
    }));
  };

  const handleSaveAll = () => {
    const allPrompts = {
      summary_prompt: summaryPrompt,
      seo_prompt: seoPrompt,
      image_prompt: imagePrompt,
      platform_prompts: platformTabs,
    };
    console.log('儲存的 Prompt 設定:', allPrompts);
    setPromptConfig(allPrompts);
    if (onSave) onSave(allPrompts);
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Prompt 設定
      </Typography>

      {/* 摘要 Prompt 區塊 */}
      <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          摘要 Prompt
        </Typography>
        <Tabs value={languageTab} onChange={(e, val) => setLanguageTab(val)} sx={{ mb: 2 }}>
          {languages.map((lang) => (
            <Tab key={lang.code} label={lang.label} />
          ))}
        </Tabs>
        {languages.map((lang, idx) => (
          <Box key={lang.code} sx={{ display: idx === languageTab ? 'block' : 'none' }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label={`${lang.label} 摘要 Prompt`}
              value={summaryPrompt[lang.code] || ''}
              onChange={(e) =>
                setSummaryPrompt((prev) => ({ ...prev, [lang.code]: e.target.value }))
              }
            />
          </Box>
        ))}
      </Card>

      {/* SEO Prompt 區塊 */}
      <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          SEO Prompt
        </Typography>
        <Tabs value={seoTab} onChange={(e, val) => setSeoTab(val)} sx={{ mb: 2 }}>
          {languages.map((lang) => (
            <Tab key={lang.code} label={lang.label} />
          ))}
        </Tabs>
        {languages.map((lang, idx) => (
          <Box key={lang.code} sx={{ display: idx === seoTab ? 'block' : 'none' }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label={`${lang.label} SEO Prompt`}
              value={seoPrompt[lang.code] || ''}
              onChange={(e) =>
                setSeoPrompt((prev) => ({ ...prev, [lang.code]: e.target.value }))
              }
            />
          </Box>
        ))}
      </Card>

      {/* 生成圖片 Prompt */}
      <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          生成圖片 Prompt
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="圖片生成 Prompt"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
        />
      </Card>

      {/* 平台發文 Prompt */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            社群平台發文 Prompt
          </Typography>

          <TextField
            select
            label="選擇平台"
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setLanguageTab(0);
            }}
            sx={{ mb: 2 }}
          >
            {platforms.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>

          <Tabs
            value={languageTab}
            onChange={(e, val) => setLanguageTab(val)}
            sx={{ mb: 2 }}
          >
            {languages.map((lang) => (
              <Tab key={lang.code} label={lang.label} />
            ))}
          </Tabs>

          {languages.map((lang, idx) => (
            <Box key={lang.code} sx={{ display: idx === languageTab ? 'block' : 'none' }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label={`${lang.label} Prompt`}
                value={platformTabs[selectedPlatform]?.[lang.code] || ''}
                onChange={(e) =>
                  handlePromptChange(selectedPlatform, lang.code, e.target.value)
                }
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* 儲存按鈕 */}
      <Box textAlign="right">
        <Button variant="contained" color="primary" onClick={handleSaveAll}>
          儲存設定
        </Button>
      </Box>
    </Box>
  );
}
