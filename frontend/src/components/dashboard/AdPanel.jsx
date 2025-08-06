import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppContext } from '../../context/AppContext';

export default function AdPanel({ onSave }) {
  const { adConfig, setAdConfig } = useContext(AppContext);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    setAds(adConfig || []);
  }, [adConfig]);

  const handleAddAd = () => {
    setAds([...ads, { image: '', link: '' }]);
  };

  const handleRemoveAd = (index) => {
    const updated = [...ads];
    updated.splice(index, 1);
    setAds(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...ads];
    updated[index][field] = value;
    setAds(updated);
  };

  const handleSubmit = () => {
    console.log('儲存廣告設定:', ads);
    setAdConfig(ads);
    if (onSave) onSave(ads);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        設定廣告區塊
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
        {ads.map((ad, index) => (
          <Grid container spacing={2} key={index} alignItems="center" mb={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                label="圖片網址"
                variant="outlined"
                fullWidth
                value={ad.image}
                onChange={(e) => handleChange(index, 'image', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="外部連結"
                variant="outlined"
                fullWidth
                value={ad.link}
                onChange={(e) => handleChange(index, 'link', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton onClick={() => handleRemoveAd(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button variant="outlined" onClick={handleAddAd} startIcon={<AddIcon />} sx={{ mt: 1 }}>
          新增廣告
        </Button>
      </Paper>

      <Box textAlign="right">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          儲存設定
        </Button>
      </Box>
    </Box>
  );
}
