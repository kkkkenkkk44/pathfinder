// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [newsConfig, setNewsConfig] = useState(null);
  const [promptConfig, setPromptConfig] = useState(null);
  const [githubToken, setGithubToken] = useState(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('github_token');
    if (tokenFromStorage && !githubToken) {
      setGithubToken(tokenFromStorage);
    }
  }, []);


  return (
    <AppContext.Provider value={{ newsConfig, setNewsConfig, promptConfig, setPromptConfig, githubToken, setGithubToken }}>
      {children}
    </AppContext.Provider>
  );
};
