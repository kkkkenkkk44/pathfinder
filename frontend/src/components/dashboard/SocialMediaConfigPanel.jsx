import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Divider,
  InputAdornment,
} from '@mui/material';
import { AppContext } from '../../context/AppContext';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';

const platforms = ['Facebook', 'X', 'Threads', 'Instagram'];

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

export default function SocialMediaConfigPanel({ onSave }) {
  const { socialConfig, setSocialConfig } = useContext(AppContext);

  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [platformCredentials, setPlatformCredentials] = useState({});

  const [postFrequencyType, setPostFrequencyType] = useState('daily');
  const [postFrequencyHour, setPostFrequencyHour] = useState('00');
  const [postWeekDay, setPostWeekDay] = useState('0');

  useEffect(() => {
    if (socialConfig) {
      const { post_frequency_type, post_frequency_hour, post_frequency_day, ...credentials } =
        socialConfig;

      setPlatformCredentials(credentials);
      setPostFrequencyType(post_frequency_type || 'daily');
      setPostFrequencyHour(post_frequency_hour || '00');
      setPostWeekDay(post_frequency_day || '0');
    }
  }, [socialConfig]);

  const handleCredentialChange = (platform, field, value) => {
    setPlatformCredentials((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const handleSaveAll = () => {
    const configPayload = {
      ...platformCredentials,
      post_frequency_type: postFrequencyType,
      post_frequency_hour: postFrequencyHour,
      post_frequency_day: postFrequencyType === 'weekly' ? postWeekDay : undefined,
    };

    console.log('🧾 儲存社群設定：', configPayload);
    setSocialConfig(configPayload);
    if (onSave) onSave(configPayload);
  };

  const credentialFields = {
    Facebook: ['client_id', 'client_secret', 'access_token'],
    X: ['api_key', 'api_secret', 'access_token', 'access_token_secret'],
    Threads: ['username', 'password'],
    Instagram: ['access_token', 'client_id'],
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        <ShareIcon sx={{ mr: 1 }} />
        社群平台發文設定
      </Typography>

      {/* 憑證設定 */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            <SettingsIcon sx={{ mr: 1 }} />
            憑證設定
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="選擇平台"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                fullWidth
              >
                {platforms.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {credentialFields[selectedPlatform].map((field) => (
              <Grid key={field} item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={field.replace(/_/g, ' ').toUpperCase()}
                  value={platformCredentials[selectedPlatform]?.[field] || ''}
                  onChange={(e) =>
                    handleCredentialChange(selectedPlatform, field, e.target.value)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* 發文頻率設定 */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            <AccessTimeIcon sx={{ mr: 1 }} />
            發文頻率
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="發文頻率"
                value={postFrequencyType}
                onChange={(e) => setPostFrequencyType(e.target.value)}
                fullWidth
              >
                {frequencyTypes.map((f) => (
                  <MenuItem key={f.value} value={f.value}>
                    {f.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {postFrequencyType === 'weekly' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="發文星期幾"
                  value={postWeekDay}
                  onChange={(e) => setPostWeekDay(e.target.value)}
                  fullWidth
                >
                  {weekDays.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                label="發文時間（24hr，例如 14）"
                value={postFrequencyHour}
                onChange={(e) => setPostFrequencyHour(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 儲存按鈕 */}
      <Box textAlign="right" mt={4}>
        <Button variant="contained" color="primary" size="large" onClick={handleSaveAll}>
          儲存設定
        </Button>
      </Box>
    </Box>
  );
}
