// frontend/src/pages/SignIn.js
import * as React from 'react';
import { Container, Box, Avatar, Typography, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function SignIn() {
  const handleGithubSignIn = () => {
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_REACT_REDIRECT;
    const scope = 'repo';

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'black' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign in
          </Typography>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GitHubIcon />}
            onClick={handleGithubSignIn}
            sx={{
              backgroundColor: '#24292e',
              color: 'white',
              '&:hover': { backgroundColor: '#1b1f23' },
              textTransform: 'none',
              fontSize: 16,
              paddingY: 1.5,
            }}
          >
            Sign in with GitHub
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
