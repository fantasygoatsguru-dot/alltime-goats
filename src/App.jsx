import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AlltimeLayout from "./components/AlltimeLayout";
import GoogleAnalytics from "./components/GoogleAnalytics";
import DatabaseLoader from "./components/DatabaseLoader";
import TagManager from 'react-gtm-module';
import React from "react";
import { Box } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: { main: "#4a90e2" },
        secondary: { main: "#37474f" },
        background: { default: "#121212", paper: "#1e1e1e" },
        text: { primary: "#e0e0e0", secondary: "#b0bec5" },
    },
    typography: { h6: { fontWeight: 600 } },
});

const tagManagerArgs = {
    gtmId: "GTM-NL93ZTKQ",
};

TagManager.initialize(tagManagerArgs);

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <GoogleAnalytics />
            <DatabaseLoader>
                <Box sx={{ flexGrow: 1 }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/seasons" replace />} />
                        <Route path="/*" element={<AlltimeLayout />} />
                    </Routes>
                </Box>
            </DatabaseLoader>
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