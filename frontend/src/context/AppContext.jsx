import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [newsConfig, setNewsConfig] = useState(null);
  const [promptConfig, setPromptConfig] = useState(null);
  const [githubToken, setGithubToken] = useState(null);
  const [socialConfig, setSocialConfig] = useState(null);
  const [adConfig, setAdConfig] = useState(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('github_token');
    if (tokenFromStorage && !githubToken) {
      setGithubToken(tokenFromStorage);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        newsConfig,
        setNewsConfig,
        promptConfig,
        setPromptConfig,
        githubToken,
        setGithubToken,
        socialConfig,
        setSocialConfig,
        adConfig,
        setAdConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
