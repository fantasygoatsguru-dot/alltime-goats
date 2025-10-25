// src/components/LoadingSpinner.jsx
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ loading, error, teams, minHeight = "calc(100vh - 64px)" }) => {
    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: minHeight,
                    background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
                }}
            >
                <CircularProgress size={60} sx={{ color: "#4a90e2" }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, minHeight: minHeight }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    if (!teams || teams.length === 0) {
        return (
            <Box sx={{ p: 3, minHeight: minHeight }}>
                <Typography color="#e0e0e0">No team data available.</Typography>
            </Box>
        );
    }

    return null; // If none of the above conditions are met, render nothing
};

export default LoadingSpinner;