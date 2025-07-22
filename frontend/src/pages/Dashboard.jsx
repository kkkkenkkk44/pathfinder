import React, { useState, useContext } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import AppBarHeader from '../components/AppBarHeader';
import DrawerSidebar from '../components/DrawerSidebar';
import NewsPanel from '../components/dashboard/NewsPanel';
import PromptPanel from '../components/dashboard/PromptPanel';
import SettingsReviewPanel from '../components/dashboard/SettingsReviewPanel';
import LogoutPanel from '../components/dashboard/LogoutPanel';
import { AppContext } from '../context/AppContext'; // 引入 context

const drawerWidth = 240;

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('News');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { setNewsConfig, setPromptConfig } = useContext(AppContext); // 用 context 儲存

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'News':
        return <NewsPanel onSave={(data) => setNewsConfig(data)} />;
      case 'Prompt':
        return <PromptPanel onSave={(data) => setPromptConfig(data)} />;
      case 'SettingsReview':
        return <SettingsReviewPanel />;
      case 'Logout':
        return <LogoutPanel />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarHeader onDrawerToggle={handleDrawerToggle} />
      <DrawerSidebar
        selectedTab={selectedTab}
        onSelect={(tab) => {
          setSelectedTab(tab);
          setMobileOpen(false);
        }}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          marginLeft: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}
