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

const platforms = ['Facebook', 'Instagram', 'Threads', 'X'];
const languages = [
  { label: '中文', code: 'zh' },
  { label: 'English', code: 'en' },
  { label: '日本語', code: 'ja' },
];

export default function PromptPanel({ onSave }) {
  const { promptConfig, setPromptConfig } = useContext(AppContext);

  const [summaryPrompt, setSummaryPrompt] = useState(
    {
        zh: `你是一位專業的內容編輯，擅長將各類原始文本（如報告、訪談、文章、研究、演講稿等）濃縮為條理清晰、邏輯嚴謹的摘要。你的任務是協助讀者快速掌握背景脈絡、核心觀點與重點內容，必要時也可點出後續發展、可能影響或關鍵討論。請使用繁體中文撰寫，語氣自然流暢，資訊準確中立。摘要應避免贅詞，強調結構性與可讀性，並可作為後續深入分析、報導撰寫、或 SEO 優化內容的基礎。`,
        en: `You are a professional content editor who specializes in condensing various types of source texts—such as reports, interviews, articles, research papers, and speeches—into clear, well-structured summaries. Your task is to help readers quickly grasp the background, core viewpoints, and key takeaways. When necessary, you may also highlight follow-up developments, potential impacts, or important discussions. Please write in English with a natural and fluent tone, ensuring information is accurate and objective. The summary should avoid redundancy, emphasize logical structure and readability, and serve as a foundation for in-depth analysis, reporting, or SEO-optimized content.`, 
        ja: `あなたはプロのコンテンツ編集者であり、レポート、インタビュー、記事、研究、スピーチなど、さまざまな種類の原文を、構成が明確で論理的な要約にまとめることを専門としています。あなたの役割は、読者が背景、核心的な視点、重要なポイントを迅速に把握できるよう支援することです。必要に応じて、今後の展開、影響の可能性、または注目すべき議論についても言及してください。要約は日本語で自然かつ流暢な文体で執筆し、情報は正確かつ中立である必要があります。冗長な表現を避け、構造的で読みやすい要約を心がけてください。これらの要約は、今後の詳細な分析、記事執筆、または SEO コンテンツの基盤としても使用されます。`
    });
  const [seoPrompt, setSeoPrompt] = useState(
    {
        zh: `你是一位專業的 SEO 寫手，擅長撰寫結構清晰、語氣親切、內容權威又淺顯易懂的文章，適用於多元主題（如科技、教育、財經、生活、政策、健康、旅遊等）。請用繁體中文撰寫內容，語氣如同在與一般讀者、學生或對該領域有興趣的大眾解釋一個重要主題。文章應符合 SEO 寫作邏輯，包含段落結構明確的標題（如 <h1>、<h2>、<h3>）、適當關鍵字鋪排、通俗易懂的文字，以及具體實用的內容。請用 HTML 格式 產出全文，便於直接應用於網站。`,
        en: '',
        ja: '' 
    });
  const [imagePrompt, setImagePrompt] = useState('請為這篇文章生成一張符合主題、具吸引力的圖片，風格需寫實，避免過度誇張。');
  const [platformTabs, setPlatformTabs] = useState({});
  const [selectedPlatform, setSelectedPlatform] = useState('Facebook');
  const [languageTab, setLanguageTab] = useState(0);
  const [seoTab, setSeoTab] = useState(0);

  useEffect(() => {
    if (promptConfig) {
      setSummaryPrompt(promptConfig.summary_prompt || { zh: '', en: '', ja: '' });
      setSeoPrompt(promptConfig.seo_prompt || { zh: '', en: '', ja: '' });
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
