import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AlltimeLayout from "./components/AlltimeLayout";
import GoogleAnalytics from "./components/GoogleAnalytics";
import SEOHead from "./components/SEOHead";
import StructuredData from "./components/StructuredData";
import TagManager from "react-gtm-module";
import React from "react";
import { Box } from "@mui/material";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import { AuthProvider } from "./contexts/AuthContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#2e7d32" },
    background: { default: "#f8f9fa", paper: "#ffffff" },
    text: { primary: "#212121", secondary: "#424242" },
    success: { main: "#4caf50" },
    info: { main: "#2196f3" },
    warning: { main: "#ff9800" },
    error: { main: "#f44336" },
  },
  typography: { 
    h6: { fontWeight: 600 },
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const tagManagerArgs = {
  gtmId: "GTM-NL93ZTKQ",
};

TagManager.initialize(tagManagerArgs);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SEOHead />
        <StructuredData />
        <GoogleAnalytics />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/rankings" replace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AlltimeLayout />} />
            <Route path="/profile" element={<AlltimeLayout />} />
            <Route path="/teams" element={<AlltimeLayout />} />
            <Route path="/seasons" element={<AlltimeLayout />} />
            <Route path="/table" element={<AlltimeLayout />} />
            <Route path="/ultimate-winner" element={<AlltimeLayout />} />
            <Route path="/games" element={<AlltimeLayout />} />
            <Route path="/matchup" element={<AlltimeLayout />} />
            <Route path="/my-team" element={<AlltimeLayout />} />
            <Route path="/matchup-projection" element={<AlltimeLayout />} />
            <Route path="/category-breakdown" element={<AlltimeLayout />} />
            <Route path="/rankings" element={<AlltimeLayout />} />
            <Route path="/season-games" element={<AlltimeLayout />} />
            <Route path="/chat" element={<AlltimeLayout />} />
            <Route path="/playoffs" element={<AlltimeLayout />} />
            <Route path="/nba-playoffs" element={<AlltimeLayout />} />
            <Route path="/my-league-playoffs" element={<AlltimeLayout />} />
            <Route path="/nba-regular-season" element={<AlltimeLayout />} />
            <Route path="/my-league-regular-season" element={<AlltimeLayout />} />
            <Route path="/*" element={<Navigate to="/matchup" replace />} />
          </Routes>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}