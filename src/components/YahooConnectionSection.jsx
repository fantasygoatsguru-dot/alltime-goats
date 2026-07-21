import React from "react";
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SwitchIcon from "@mui/icons-material/SwapHoriz";
import YahooConnect from "./YahooConnect";

const YahooConnectionSection = ({
    isConnected,
    loading,
    userLeagues,
    allLeagueTeams,
    selectedTeam1,
    selectedTeam2,
    onTeamSelect,
    onSwitchTeams,
    showTeamSelectors = true,
}) => {
    if (!isConnected && userLeagues?.length === 0) {
        // Standardized subtle connect button (shared with rankings, top games, etc.).
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <YahooConnect variant="button" label="Load your team from Yahoo" />
            </Box>
        );
    }

    if (!isConnected || userLeagues?.length === 0) return null;

    // If showTeamSelectors is false, don't show the team selection UI
    if (!showTeamSelectors) {
        return null;
    }

    return (
        <Box
            sx={{
                mb: 4,
                p: 3,
                borderRadius: 2,
                maxWidth: 800,
                mx: "auto",
                border: "1px solid #333",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    textAlign: "center",
                    mb: 3,
                    color: "#4a90e2",
                    fontFamily: '"Roboto Mono", monospace',
                    fontWeight: "bold",
                }}
            >
                Select Teams to Compare
            </Typography>

            <Grid container spacing={2} alignItems="center" justifyContent="center">
                {allLeagueTeams?.length > 0 ? (
                    <>
                        <Grid item xs={12} sm={5}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: "#424242", fontFamily: '"Roboto Mono", monospace' }}>
                                    Team 1
                                </InputLabel>
                                <Select
                                    value={selectedTeam1}
                                    onChange={(e) => onTeamSelect("team1", e.target.value)}
                                    label="Team 1"
                                    sx={{
                                        color: "#212121",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4a90e2" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#80deea" },
                                        "& .MuiSelect-icon": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    {allLeagueTeams.map((team) => (
                                        <MenuItem
                                            key={team.key}
                                            value={team.name}
                                            disabled={team.name === selectedTeam2}
                                            sx={{ fontFamily: '"Roboto Mono", monospace' }}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <IconButton
                                    onClick={onSwitchTeams}
                                    sx={{
                                        color: "#4a90e2",
                                        "&:hover": { bgcolor: "rgba(74, 144, 226, 0.1)" },
                                    }}
                                >
                                    <SwitchIcon />
                                </IconButton>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={5}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: "#424242", fontFamily: '"Roboto Mono", monospace' }}>
                                    Team 2
                                </InputLabel>
                                <Select
                                    value={selectedTeam2}
                                    onChange={(e) => onTeamSelect("team2", e.target.value)}
                                    label="Team 2"
                                    sx={{
                                        color: "#212121",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4a90e2" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#80deea" },
                                        "& .MuiSelect-icon": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    {allLeagueTeams.map((team) => (
                                        <MenuItem
                                            key={team.key}
                                            value={team.name}
                                            disabled={team.name === selectedTeam1}
                                            sx={{ fontFamily: '"Roboto Mono", monospace' }}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {loading && (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2, gap: 1 }}>
                                    <CircularProgress size={20} sx={{ color: "#4a90e2" }} />
                                    <Typography sx={{ color: "#b0bec5", fontFamily: '"Roboto Mono", monospace' }}>
                                        Loading teams...
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </>
                ) : loading ? (
                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                            <CircularProgress size={24} sx={{ color: "#4a90e2" }} />
                            <Typography sx={{ color: "#b0bec5", fontFamily: '"Roboto Mono", monospace' }}>
                                Loading your teams...
                            </Typography>
                        </Box>
                    </Grid>
                ) : null}
            </Grid>
        </Box>
    );
};

export default YahooConnectionSection;