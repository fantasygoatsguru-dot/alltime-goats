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

const YahooConnectionSection = ({
    isConnected,
    loading,
    userLeagues,
    selectedLeague,
    onLeagueChange,
    onYahooConnect,
    allLeagueTeams,
    selectedTeam1,
    selectedTeam2,
    onTeamSelect,
    onSwitchTeams,
}) => {
    if (!isConnected && userLeagues.length === 0) {
        return (
            <Box sx={{ mb: 4, p: 2, bgcolor: "#252525", borderRadius: 1, textAlign: "center" }}>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        color: "#e0e0e0",
                        fontFamily: '"Roboto Mono", monospace',
                    }}
                >
                    Add your players or load them from Yahoo Fantasy
                </Typography>
                <Button
                    variant="outlined"
                    onClick={onYahooConnect}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SportsBasketballIcon />}
                    sx={{
                        color: "#4a90e2",
                        borderColor: "#4a90e2",
                        "&:hover": {
                            borderColor: "#80deea",
                            bgcolor: "rgba(74, 144, 226, 0.1)",
                        },
                        fontFamily: '"Roboto Mono", monospace',
                        px: 4,
                        py: 1.5,
                    }}
                >
                    {loading ? "Connecting..." : "Connect to Yahoo Fantasy"}
                </Button>
            </Box>
        );
    }

    if (!isConnected || userLeagues.length === 0) return null;

    return (
        <Box sx={{ mb: 4, p: 2, bgcolor: "#252525", borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel
                            sx={{
                                color: "#b0bec5",
                                "&.Mui-focused": { color: "#4a90e2" },
                            }}
                        >
                            Select League
                        </InputLabel>
                        <Select
                            value={selectedLeague}
                            onChange={(e) => onLeagueChange(e.target.value)}
                            label="Select League"
                            sx={{
                                bgcolor: "#252525",
                                color: "#e0e0e0",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#4a90e2",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#80deea",
                                },
                                "& .MuiSelect-icon": { color: "#4a90e2" },
                            }}
                        >
                            {userLeagues.map((league) => (
                                <MenuItem key={league.leagueId} value={league.leagueId}>
                                    {league.name} ({league.season})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {allLeagueTeams.length > 0 ? (
                    <>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel
                                    sx={{
                                        color: "#b0bec5",
                                        "&.Mui-focused": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    Team 1
                                </InputLabel>
                                <Select
                                    value={selectedTeam1}
                                    onChange={(e) => onTeamSelect("team1", e.target.value)}
                                    label="Team 1"
                                    sx={{
                                        bgcolor: "#252525",
                                        color: "#e0e0e0",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#4a90e2",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#80deea",
                                        },
                                        "& .MuiSelect-icon": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    {allLeagueTeams.map((team) => (
                                        <MenuItem 
                                            key={team.key} 
                                            value={team.name}
                                            disabled={team.name === selectedTeam2}
                                            sx={{
                                                fontFamily: '"Roboto Mono", monospace',
                                                "&.Mui-disabled": { opacity: 0.5 },
                                            }}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={1}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                onClick={onSwitchTeams}
                                sx={{
                                    color: "#4a90e2",
                                    "&:hover": {
                                        color: "#80deea",
                                        backgroundColor: "rgba(74, 144, 226, 0.1)",
                                    },
                                }}
                            >
                                <SwitchIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel
                                    sx={{
                                        color: "#b0bec5",
                                        "&.Mui-focused": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    Team 2
                                </InputLabel>
                                <Select
                                    value={selectedTeam2}
                                    onChange={(e) => onTeamSelect("team2", e.target.value)}
                                    label="Team 2"
                                    sx={{
                                        bgcolor: "#252525",
                                        color: "#e0e0e0",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#4a90e2",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#80deea",
                                        },
                                        "& .MuiSelect-icon": { color: "#4a90e2" },
                                        fontFamily: '"Roboto Mono", monospace',
                                    }}
                                >
                                    {allLeagueTeams.map((team) => (
                                        <MenuItem 
                                            key={team.key} 
                                            value={team.name}
                                            disabled={team.name === selectedTeam1}
                                            sx={{
                                                fontFamily: '"Roboto Mono", monospace',
                                                "&.Mui-disabled": { opacity: 0.5 },
                                            }}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {loading && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} />
                                    <Typography
                                        sx={{
                                            color: "#b0bec5",
                                            fontFamily: '"Roboto Mono", monospace',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Loading...
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </>
                ) : loading ? (
                    <Grid item xs={12} md={9}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} />
                            <Typography
                                sx={{
                                    color: "#b0bec5",
                                    fontFamily: '"Roboto Mono", monospace',
                                }}
                            >
                                Loading team data from Yahoo...
                            </Typography>
                        </Box>
                    </Grid>
                ) : null}
            </Grid>
        </Box>
    );
};

export default YahooConnectionSection;

