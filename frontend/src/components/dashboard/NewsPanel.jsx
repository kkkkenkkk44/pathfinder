import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Chip,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import TagIcon from '@mui/icons-material/Tag';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GitHubIcon from '@mui/icons-material/GitHub';
import { AppContext } from '../../context/AppContext';

const frequencyTypes = [
  { value: 'daily', label: '每日' },
  { value: 'weekly', label: '每週' },
];

const weekDays = [
  { value: '0', label: '星期日' },
  { value: '1', label: '星期一' },
  { value: '2', label: '星期二' },
  { value: '3', label: '星期三' },
  { value: '4', label: '星期四' },
  { value: '5', label: '星期五' },
  { value: '6', label: '星期六' },
];

export default function NewsPanel({ onSave }) {
  const { newsConfig, setNewsConfig } = useContext(AppContext);

  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [frequencyType, setFrequencyType] = useState('daily');
  const [frequencyHour, setFrequencyHour] = useState('00');
  const [weekDay, setWeekDay] = useState('0');
  const [repo, setRepo] = useState('');

  useEffect(() => {
    if (newsConfig) {
      setKeywords(newsConfig.keywords || []);
      setUrls(newsConfig.urls || []);
      setFrequencyType(newsConfig.frequency_type || 'daily');
      setFrequencyHour(newsConfig.frequency_hour || '00');
      setWeekDay(newsConfig.frequency_day || '0');
      setRepo(newsConfig.repo || '');
    }
  }, [newsConfig]);

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setUrls([...urls, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleSubmit = () => {
    const payload = {
      keywords,
      urls,
      frequency_type: frequencyType,
      frequency_hour: frequencyHour,
      frequency_day: frequencyType === 'weekly' ? weekDay : undefined,
      repo,
    };
    console.log('📤 Submitting:', payload);
    setNewsConfig(payload);
    if (onSave) onSave(payload);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        設定新聞來源與條件
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={2}>
          {/* 關鍵字 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="新增關鍵字"
              variant="outlined"
              fullWidth
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TagIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button onClick={handleAddKeyword}>
                    <AddIcon />
                  </Button>
                ),
              }}
            />
            <Box mt={1}>
              {keywords.map((kw, index) => (
                <Chip
                  key={index}
                  label={kw}
                  onDelete={() => setKeywords(keywords.filter((_, i) => i !== index))}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Grid>

          {/* 網址 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="新增網址"
              variant="outlined"
              fullWidth
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Button onClick={handleAddUrl}>
                    <AddIcon />
                  </Button>
                ),
              }}
            />
            <Box mt={1}>
              {urls.map((url, index) => (
                <Chip
                  key={index}
                  label={url}
                  onDelete={() => setUrls(urls.filter((_, i) => i !== index))}
                  sx={{ m: 0.5 }}
                  color="primary"
                />
              ))}
            </Box>
          </Grid>

          {/* 頻率類型 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>抓取頻率</InputLabel>
              <Select
                value={frequencyType}
                label="抓取頻率"
                onChange={(e) => setFrequencyType(e.target.value)}
              >
                {frequencyTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 每週幾（僅 weekly 有效） */}
          {frequencyType === 'weekly' && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>星期幾執行</InputLabel>
                <Select
                  value={weekDay}
                  label="星期幾執行"
                  onChange={(e) => setWeekDay(e.target.value)}
                >
                  {weekDays.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* 時間 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="執行時間（例如 08 表示早上 8 點）"
              variant="outlined"
              fullWidth
              value={frequencyHour}
              onChange={(e) => setFrequencyHour(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ScheduleIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Repo 名稱 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="GitHub Repo 名稱"
              variant="outlined"
              fullWidth
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 外部按鈕，與 PromptPanel 相同設計 */}
      <Box mt={3} textAlign="right">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          儲存設定
        </Button>
      </Box>
    </Box>
  );
}
