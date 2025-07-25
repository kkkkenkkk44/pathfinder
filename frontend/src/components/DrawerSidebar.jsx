import React from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ShareIcon from '@mui/icons-material/Share';

const drawerWidth = 240;

export default function DrawerSidebar({ selectedTab, onSelect, mobileOpen, onClose }) {
  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          { label: 'News', icon: <ArticleIcon /> },
          { label: 'Prompt', icon: <ChatIcon /> },
          { label: 'Social Media', icon: <ShareIcon /> },
          { label: 'Settings Review', icon: <SettingsIcon /> },
          { label: 'Logout', icon: <LogoutIcon /> },
        ].map((item) => (
          <ListItemButton
            key={item.label}
            selected={selectedTab === item.label}
            onClick={() => {
              onSelect(item.label);
              if (onClose) onClose(); // ← 加這行
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {/* 手機：temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 桌機：permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
