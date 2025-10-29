import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Autocomplete,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
} from "@mui/material";
import RadarIcon from "@mui/icons-material/Radar";
import DeleteIcon from "@mui/icons-material/Delete";
import SwitchIcon from "@mui/icons-material/SwapHoriz";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend,
} from "recharts";
import { fetchAllTimePlayerStats, fetchAllPlayers } from "../api";
import AddIcon from "@mui/icons-material/Add";

// Define preset teams
const presetTeams = [
    {
        name: "Custom Team 1",
        players: [],
    },
    {
        name: "Custom Team 2",
        players: [],
    },
    {
        name: "92 Dream Team",
        players: [
            { id: "893", name: "Michael Jordan", season: "1991-92", active: true },
            { id: "77142", name: "Magic Johnson", season: "1991-92", active: true },
            { id: "1449", name: "Larry Bird", season: "1991-92", active: true },
            { id: "787", name: "Charles Barkley", season: "1991-92", active: true },
            { id: "121", name: "Patrick Ewing", season: "1991-92", active: true },
            { id: "764", name: "David Robinson", season: "1991-92", active: true },
            { id: "252", name: "Karl Malone", season: "1991-92", active: true },
            { id: "304", name: "John Stockton", season: "1991-92", active: true },
            { id: "937", name: "Scottie Pippen", season: "1991-92", active: true },
            { id: "17", name: "Clyde Drexler", season: "1991-92", active: true },
            { id: "904", name: "Chris Mullin", season: "1991-92", active: true },
        ],
    },
    {
        name: "08 Redeem Team",
        players: [
            { id: "977", name: "Kobe Bryant", season: "2007-08", active: true },
            { id: "2544", name: "LeBron James", season: "2007-08", active: true },
            { id: "2548", name: "Dwyane Wade", season: "2007-08", active: true },
            { id: "2546", name: "Carmelo Anthony", season: "2007-08", active: true },
            { id: "2730", name: "Dwight Howard", season: "2007-08", active: true },
            { id: "101108", name: "Chris Paul", season: "2007-08", active: true },
            { id: "467", name: "Jason Kidd", season: "2007-08", active: true },
            { id: "2419", name: "Tayshaun Prince", season: "2007-08", active: true },
            { id: "2430", name: "Carlos Boozer", season: "2007-08", active: true },
            { id: "2547", name: "Chris Bosh", season: "2007-08", active: true },
            { id: "101114", name: "Deron Williams", season: "2007-08", active: true },
        ],
    },
    {
        name: "European GOATs",
        players: [
            { id: "1717", name: "Dirk Nowitzki", season: "2006-07", active: true },
            { id: "203507", name: "Giannis Antetokounmpo", season: "2020-21", active: true },
            { id: "203999", name: "Nikola Jokić", season: "2022-23", active: true },
            { id: "1629029", name: "Luka Dončić", season: "2023-24", active: true },
            { id: "2225", name: "Tony Parker", season: "2006-07", active: true },
            { id: "2200", name: "Pau Gasol", season: "2009-10", active: true },
            { id: "77845", name: "Dražen Petrović", season: "1992-93", active: true },
        ],
    },
    {
        name: "American GOATs",
        players: [
            { id: "893", name: "Michael Jordan", season: "1989-90", active: true },
            { id: "2544", name: "LeBron James", season: "2012-13", active: true },
            { id: "977", name: "Kobe Bryant", season: "2005-06", active: true },
            { id: "406", name: "Shaquille O'Neal", season: "1999-00", active: true },
            { id: "77142", name: "Magic Johnson", season: "1986-87", active: true },
            { id: "1449", name: "Larry Bird", season: "1985-86", active: true },
            { id: "76375", name: "Wilt Chamberlain", season: "1961-62", active: true },
            { id: "78049", name: "Bill Russell", season: "1961-62", active: true },
        ],
    },
    {
        name: "60s Greats",
        players: [
            { id: "76375", name: "Wilt Chamberlain", season: "1961-62", active: true },
            { id: "78049", name: "Bill Russell", season: "1961-62", active: true },
            { id: "600015", name: "Oscar Robertson", season: "1961-62", active: true },
            { id: "76127", name: "Elgin Baylor", season: "1961-62", active: true },
            { id: "78497", name: "Jerry West", season: "1961-62", active: true },
            { id: "77847", name: "Bob Pettit", season: "1961-62", active: true },
        ],
    },
    {
        name: "70s Greats",
        players: [
            { id: "76003", name: "Kareem Abdul-Jabbar", season: "1971-72", active: true },
            { id: "600013", name: "Rick Barry", season: "1974-75", active: true },
            { id: "76979", name: "Elvin Hayes", season: "1974-75", active: true },
            { id: "76970", name: "John Havlicek", season: "1971-72", active: true },
            { id: "77498", name: "Bob McAdoo", season: "1974-75", active: true },
            { id: "76750", name: "Walt Frazier", season: "1971-72", active: true },
        ],
    },
    {
        name: "80s Greats",
        players: [
            { id: "77142", name: "Magic Johnson", season: "1986-87", active: true },
            { id: "1449", name: "Larry Bird", season: "1985-86", active: true },
            { id: "893", name: "Michael Jordan", season: "1987-88", active: true },
            { id: "78318", name: "Isiah Thomas", season: "1984-85", active: true },
            { id: "77449", name: "Moses Malone", season: "1982-83", active: true },
            { id: "1450", name: "Kevin McHale", season: "1986-87", active: true },
        ],
    },
    {
        name: "90s Greats",
        players: [
            { id: "893", name: "Michael Jordan", season: "1995-96", active: true },
            { id: "165", name: "Hakeem Olajuwon", season: "1993-94", active: true },
            { id: "252", name: "Karl Malone", season: "1996-97", active: true },
            { id: "787", name: "Charles Barkley", season: "1992-93", active: true },
            { id: "937", name: "Scottie Pippen", season: "1993-94", active: true },
            { id: "764", name: "David Robinson", season: "1994-95", active: true },
        ],
    },
    {
        name: "00s Greats",
        players: [
            { id: "1495", name: "Tim Duncan", season: "2002-03", active: true },
            { id: "406", name: "Shaquille O'Neal", season: "2000-01", active: true },
            { id: "977", name: "Kobe Bryant", season: "2005-06", active: true },
            { id: "708", name: "Kevin Garnett", season: "2003-04", active: true },
            { id: "947", name: "Allen Iverson", season: "2000-01", active: true },
            { id: "1717", name: "Dirk Nowitzki", season: "2005-06", active: true },
        ],
    },
    {
        name: "10s Greats",
        players: [
            { id: "2544", name: "LeBron James", season: "2012-13", active: true },
            { id: "201142", name: "Kevin Durant", season: "2013-14", active: true },
            { id: "201939", name: "Stephen Curry", season: "2015-16", active: true },
            { id: "202695", name: "Kawhi Leonard", season: "2015-16", active: true },
            { id: "201935", name: "James Harden", season: "2017-18", active: true },
            { id: "101108", name: "Chris Paul", season: "2014-15", active: true },
        ],
    },
    {
        name: "20s Greats",
        players: [
            { id: "203999", name: "Nikola Jokić", season: "2022-23", active: true },
            { id: "203507", name: "Giannis Antetokounmpo", season: "2020-21", active: true },
            { id: "1629029", name: "Luka Dončić", season: "2023-24", active: true },
            { id: "203954", name: "Joel Embiid", season: "2022-23", active: true },
            { id: "1628369", name: "Jayson Tatum", season: "2023-24", active: true },
            { id: "1628983", name: "Shai Gilgeous-Alexander", season: "2023-24", active: true },
        ],
    },
];

// StatsComparisonGraph Component
const StatsComparisonGraph = ({ teamAverages, team1Name, team2Name }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Initialize empty team averages if none exist
    const averages = teamAverages || {
        team1Averages: {},
        team2Averages: {},
        team1ZScores: {},
        team2ZScores: {},
        team1Contributions: {},
        team2Contributions: {}
    };
    
    console.log('StatsComparisonGraph - teamAverages:', teamAverages);
    console.log('StatsComparisonGraph - averages:', averages);

    const categories = [
        "Points",
        "3pt",
        "Assists",
        "Steals",
        "FT%",
        "FG%",
        "Turnovers",
        "Blocks",
        "Rebounds",
    ];

    const formatValue = (value, category) => {
        if (category === "FG%" || category === "FT%") {
            return `${value.toFixed(2)}%`;
        }
        return value.toFixed(2);
    };

    const data = categories.map((category) => ({
        skill: category,
        [team1Name]: averages.team1ZScores?.[category] || 0,
        [team2Name]: averages.team2ZScores?.[category] || 0,
    }));
    
    console.log('Radar chart data:', data);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const getTotalForTeam = (contributions) => {
        return contributions.reduce((sum, player) => sum + (player.value || 0), 0).toFixed(2);
    };

    const getAverageForTeam = (contributions) => {
        if (contributions.length === 0) return "0.00";
        const sum = contributions.reduce((sum, player) => sum + (player.value || 0), 0);
        return (sum / contributions.length).toFixed(2);
    };

    // Check if we have any valid data
    const hasData = teamAverages && (
        Object.keys(averages.team1ZScores || {}).length > 0 ||
        Object.keys(averages.team2ZScores || {}).length > 0
    );

    return (
        <Box sx={{ p: 2, bgcolor: "#252525", borderRadius: 1, mt: 2 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    color: "#e0e0e0",
                    fontFamily: '"Roboto Mono", monospace',
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                Team Strengths Comparison
            </Typography>
            {!hasData && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: '#b0bec5', fontFamily: '"Roboto Mono", monospace' }}>
                        Loading team data or no active players selected...
                    </Typography>
                    <Typography sx={{ color: '#666', fontFamily: '"Roboto Mono", monospace', fontSize: '0.875rem', mt: 1 }}>
                        Make sure both teams have active players enabled (eye icon)
                    </Typography>
                </Box>
            )}
            <Box sx={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius="70%" data={data}>
                        <PolarGrid stroke="#4a90e2" />
                        <PolarAngleAxis
                            dataKey="skill"
                            stroke="#e0e0e0"
                            tick={{
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: 12,
                            }}
                            onClick={(e) => handleCategoryClick(e.value)}
                            style={{ cursor: "pointer" }}
                        />
                        <Radar
                            name={team1Name}
                            dataKey={team1Name}
                            stroke="#4CAF50"
                            fill="#4CAF50"
                            fillOpacity={0.3}
                        />
                        <Radar
                            name={team2Name}
                            dataKey={team2Name}
                            stroke="#ff6f61"
                            fill="#ff6f61"
                            fillOpacity={0.3}
                        />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: "#252525",
                                border: "1px solid #4a90e2",
                                borderRadius: "4px",
                            }}
                            formatter={(value, name) => {
                                const category = data.find((d) => d[name] === value)?.skill;
                                const teamData = name === team1Name ? averages.team1Contributions : averages.team2Contributions;
                                const rawValue =
                                    category === "FG%" || category === "FT%"
                                        ? (name === team1Name ? averages.team1Averages : averages.team2Averages)?.[category] || 0
                                        : teamData?.[category]?.reduce((sum, player) => sum + (player.value || 0), 0) || 0;
                                return [`${formatValue(rawValue, category)} (Z: ${(value || 0).toFixed(2)})`, name];
                            }}
                            labelStyle={{ color: "#e0e0e0", display: "none" }}
                            cursor={{ stroke: "#4a90e2", strokeWidth: 1 }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontFamily: '"Roboto Mono", monospace',
                                color: "#e0e0e0",
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "#252525",
                        borderRadius: 1,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#e0e0e0",
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: "bold",
                    }}
                >
                    {selectedCategory} Breakdown
                </DialogTitle>
                <DialogContent>
                    {selectedCategory && (
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#4CAF50",
                                    fontFamily: '"Roboto Mono", monospace',
                                    mb: 1,
                                }}
                            >
                                {team1Name}
                            </Typography>
                            <List>
                                {averages.team1Contributions?.[selectedCategory]?.map((player, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={player.playerName}
                                            secondary={(player.value || 0).toFixed(2)}
                                            primaryTypographyProps={{
                                                sx: {
                                                    color: "#e0e0e0",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                            secondaryTypographyProps={{
                                                sx: {
                                                    color: "#4CAF50",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                <ListItem sx={{ py: 0.5, borderTop: "1px solid #4CAF50" }}>
                                    <ListItemText
                                        primary={selectedCategory === "FG%" || selectedCategory === "FT%" ? "Average" : "Total"}
                                        secondary={
                                            selectedCategory === "FG%" || selectedCategory === "FT%"
                                                ? getAverageForTeam(averages.team1Contributions?.[selectedCategory] || [])
                                                : getTotalForTeam(averages.team1Contributions?.[selectedCategory] || [])
                                        }
                                        primaryTypographyProps={{
                                            sx: {
                                                color: "#e0e0e0",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                        secondaryTypographyProps={{
                                            sx: {
                                                color: "#4CAF50",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                    />
                                </ListItem>
                            </List>

                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#ff6f61",
                                    fontFamily: '"Roboto Mono", monospace',
                                    mt: 2,
                                    mb: 1,
                                }}
                            >
                                {team2Name}
                            </Typography>
                            <List>
                                {averages.team2Contributions?.[selectedCategory]?.map((player, index) => (
                                    <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={player.playerName}
                                            secondary={(player.value || 0).toFixed(2)}
                                            primaryTypographyProps={{
                                                sx: {
                                                    color: "#e0e0e0",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                            secondaryTypographyProps={{
                                                sx: {
                                                    color: "#ff6f61",
                                                    fontFamily: '"Roboto Mono", monospace',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                                <ListItem sx={{ py: 0.5, borderTop: "1px solid #ff6f61" }}>
                                    <ListItemText
                                        primary={selectedCategory === "FG%" || selectedCategory === "FT%" ? "Average" : "Total"}
                                        secondary={
                                            selectedCategory === "FG%" || selectedCategory === "FT%"
                                                ? getAverageForTeam(averages.team2Contributions?.[selectedCategory] || [])
                                                : getTotalForTeam(averages.team2Contributions?.[selectedCategory] || [])
                                        }
                                        primaryTypographyProps={{
                                            sx: {
                                                color: "#e0e0e0",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                        secondaryTypographyProps={{
                                            sx: {
                                                color: "#ff6f61",
                                                fontFamily: '"Roboto Mono", monospace',
                                                fontWeight: "bold",
                                            },
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: "#4CAF50",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// PlayerComparisonGraph Component
const PlayerComparisonGraph = ({ 
    players = [], 
    playerNames = [], 
    onClearPlayers = () => {} 
}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        "Points",
        "3pt",
        "Assists",
        "Steals",
        "FT%",
        "FG%",
        "Turnovers",
        "Blocks",
        "Rebounds",
    ];

    const colors = ["#4CAF50", "#ff6f61", "#4a90e2", "#ffc107"];

    // Create a map of player identifiers to their data
    const playerDataMap = players.reduce((acc, player) => {
        if (!player || !player.stats || !player.playerName || !player.season) return acc;
        const playerIdentifier = `${player.playerName} (${player.season})`;
        acc[playerIdentifier] = player;
        return acc;
    }, {});

    // Filter valid player names and ensure they exist in our data map
    const validPlayerNames = playerNames.filter(name => 
        name && typeof name === "string" && playerDataMap[name]
    );

    // Create data points for each category
    const playerData = categories.map((category) => {
        const dataPoint = { skill: category };
        validPlayerNames.forEach((playerName) => {
            const player = playerDataMap[playerName];
            if (!player || !player.stats) {
                dataPoint[playerName] = 0;
                return;
            }
            let zScore = 0;
            switch (category) {
                case "Points":
                    zScore = player.stats.points_z || 0;
                    break;
                case "3pt":
                    zScore = player.stats.three_pointers_z || 0;
                    break;
                case "Assists":
                    zScore = player.stats.assists_z || 0;
                    break;
                case "Steals":
                    zScore = player.stats.steals_z || 0;
                    break;
                case "FT%":
                    zScore = player.stats.free_throw_percentage_z || 0;
                    break;
                case "FG%":
                    zScore = player.stats.field_goal_percentage_z || 0;
                    break;
                case "Turnovers":
                    zScore = player.stats.turnovers_z || 0;
                    break;
                case "Blocks":
                    zScore = player.stats.blocks_z || 0;
                    break;
                case "Rebounds":
                    zScore = player.stats.rebounds_z || 0;
                    break;
            }
            dataPoint[playerName] = zScore;
        });
        return dataPoint;
    });

    // Create radar components for each valid player
    const radarComponents = validPlayerNames.map((playerName, index) => {
        const player = playerDataMap[playerName];
        if (!player) return null;
        
        return (
            <Radar
                key={playerName}
                name={playerName}
                dataKey={playerName}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                animationDuration={800}
                animationEasing="ease-in-out"
                animationBegin={index * 100}
            />
        );
    }).filter(Boolean);

    // If no valid players, show empty state
    if (radarComponents.length === 0) {
        radarComponents.push(
            <Radar
                key="empty"
                name="Empty"
                dataKey="Empty"
                stroke="#4a90e2"
                fill="#4a90e2"
                fillOpacity={0.1}
                animationDuration={800}
                animationEasing="ease-in-out"
            />
        );
    }

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const formatValue = (value, category) => {
        const safeValue = value || 0;
        if (category === "FG%" || category === "FT%") {
            return `${safeValue.toFixed(2)}%`;
        }
        return safeValue.toFixed(2);
    };

    return (
        <Box sx={{ p: 2, bgcolor: "#252525", borderRadius: 1, mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: "#e0e0e0",
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: "bold",
                    }}
                >
                    Player Comparison
                </Typography>
                {validPlayerNames.length > 0 && (
                    <Button
                        variant="outlined"
                        onClick={onClearPlayers}
                        sx={{
                            color: "#ff6f61",
                            borderColor: "#ff6f61",
                            "&:hover": {
                                borderColor: "#ff6f61",
                                backgroundColor: "rgba(255, 111, 97, 0.1)",
                            },
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>
            <Box
                sx={{
                    height: "400px",
                    "& .recharts-radar-polygon": {
                        transition: "all 0.8s ease-in-out", // Match animation duration
                    },
                    "& .recharts-polar-angle-axis-tick": {
                        transition: "all 0.8s ease-in-out",
                    },
                    "& .recharts-polar-grid-angle": {
                        transition: "all 0.8s ease-in-out",
                    },
                    "& .recharts-legend-item": {
                        transition: "all 0.8s ease-in-out",
                    },
                    "& .recharts-surface": {
                        transition: "transform 0.8s ease-in-out", // Smooth chart scaling
                    },
                }}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius="70%" data={playerData}>
                        <PolarGrid stroke="#4a90e2" />
                        <PolarAngleAxis
                            dataKey="skill"
                            stroke="#e0e0e0"
                            tick={{
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: 12,
                            }}
                            onClick={(e) => handleCategoryClick(e.value)}
                            style={{ cursor: "pointer" }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 4]}
                            tick={false}
                            stroke="#4a90e2"
                        />
                        {radarComponents}
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: "#252525",
                                border: "1px solid #4a90e2",
                                borderRadius: "4px",
                            }}
                            formatter={(value, name) => {
                                if (name === "Empty") return ["No players selected", name];
                                const category = playerData.find((d) => d[name] === value)?.skill;
                                const player = playerDataMap[name];
                                if (player && player.stats) {
                                    let rawValue = 0;
                                    switch (category) {
                                        case "Points":
                                            rawValue = player.stats.points || 0;
                                            break;
                                        case "3pt":
                                            rawValue = player.stats.three_pointers || 0;
                                            break;
                                        case "Assists":
                                            rawValue = player.stats.assists || 0;
                                            break;
                                        case "Steals":
                                            rawValue = player.stats.steals || 0;
                                            break;
                                        case "FT%":
                                            rawValue = (player.stats.free_throw_percentage || 0) * 100;
                                            break;
                                        case "FG%":
                                            rawValue = (player.stats.field_goal_percentage || 0) * 100;
                                            break;
                                        case "Turnovers":
                                            rawValue = player.stats.turnovers || 0;
                                            break;
                                        case "Blocks":
                                            rawValue = player.stats.blocks || 0;
                                            break;
                                        case "Rebounds":
                                            rawValue = player.stats.rebounds || 0;
                                            break;
                                    }
                                    return [`${formatValue(rawValue, category)} (Z: ${(value || 0).toFixed(2)})`, name];
                                }
                                return [`${formatValue(value, category)}`, name];
                            }}
                            labelStyle={{ color: "#e0e0e0", display: "none" }}
                            cursor={{ stroke: "#4a90e2", strokeWidth: 1 }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontFamily: '"Roboto Mono", monospace',
                                color: "#e0e0e0",
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "#252525",
                        borderRadius: 1,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#e0e0e0",
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: "bold",
                    }}
                >
                    {selectedCategory} Breakdown
                </DialogTitle>
                <DialogContent>
                    {selectedCategory && (
                        <Box sx={{ mt: 2 }}>
                            {validPlayerNames.map((playerName, index) => {
                                const player = playerDataMap[playerName];
                                const stats = player?.stats || {};
                                let value = 0;

                                switch (selectedCategory) {
                                    case "Points":
                                        value = stats.points || 0;
                                        break;
                                    case "3pt":
                                        value = stats.three_pointers || 0;
                                        break;
                                    case "Assists":
                                        value = stats.assists || 0;
                                        break;
                                    case "Steals":
                                        value = stats.steals || 0;
                                        break;
                                    case "FT%":
                                        value = (stats.free_throw_percentage || 0) * 100;
                                        break;
                                    case "FG%":
                                        value = (stats.field_goal_percentage || 0) * 100;
                                        break;
                                    case "Turnovers":
                                        value = stats.turnovers || 0;
                                        break;
                                    case "Blocks":
                                        value = stats.blocks || 0;
                                        break;
                                    case "Rebounds":
                                        value = stats.rebounds || 0;
                                        break;
                                }

                                return (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: colors[index % colors.length],
                                                fontFamily: '"Roboto Mono", monospace',
                                                mb: 1,
                                            }}
                                        >
                                            {playerName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: "#e0e0e0",
                                                fontFamily: '"Roboto Mono", monospace',
                                            }}
                                        >
                                            Value: {formatValue(value, selectedCategory)}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: "#4a90e2",
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// Alltime Component
const Alltime = () => {
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);
    const [team1Players, setTeam1Players] = useState(presetTeams.find(team => team.name === "92 Dream Team").players);
    const [team2Players, setTeam2Players] = useState(presetTeams.find(team => team.name === "08 Redeem Team").players);
    const [team1Name, setTeam1Name] = useState("92 Dream Team");
    const [team2Name, setTeam2Name] = useState("08 Redeem Team");
    const [allPlayers, setAllPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("team1");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const data = await fetchAllPlayers();
                setAllPlayers(data);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };
        loadPlayers();
    }, []);

    const fetchPlayerStats = useCallback(async (players) => {
        try {
            console.log('Fetching player stats...');
            const activeTeam1Players = team1Players.filter((player) => player.active);
            const activeTeam2Players = team2Players.filter((player) => player.active);

            const allPlayersToFetch = [
                ...activeTeam1Players.map((player) => ({
                    id: player.id,
                    season: player.season,
                    team: "team1",
                })),
                ...activeTeam2Players.map((player) => ({
                    id: player.id,
                    season: player.season,
                    team: "team2",
                })),
                ...players.map((player) => ({
                    id: player.id,
                    season: player.season,
                    team: null,
                })),
            ];

            const seen = new Map();
            const uniquePlayers = allPlayersToFetch.filter((player) => {
                const key = `${player.id}-${player.season}`;
                if (!seen.has(key)) {
                    seen.set(key, player);
                    return true;
                }
                return false;
            });

            const data = await fetchAllTimePlayerStats(uniquePlayers);
            
            console.log('Fetched data:', data);
            console.log('Unique players sent:', uniquePlayers);

            const teamAveragesEntry = data.find((entry) => entry.teamAverages);
            const playerStatsData = data.filter((entry) => entry.stats && entry.playerName);
            
            console.log('Team averages entry:', teamAveragesEntry);
            console.log('Player stats data:', playerStatsData);

            setPlayerStats([
                ...playerStatsData,
                ...(teamAveragesEntry ? [{ teamAverages: teamAveragesEntry.teamAverages }] : []),
            ]);
        } catch (error) {
            console.error("Error fetching player stats:", error);
        }
    }, [team1Players, team2Players]);

    useEffect(() => {
        fetchPlayerStats(selectedPlayers);
    }, [selectedPlayers, team1Players, team2Players, fetchPlayerStats]);

    const handleAddToComparison = (playerName, season, playerId) => {
        const playerIdentifier = `${playerName} (${season})`;
        const existingIndex = selectedPlayerNames.indexOf(playerIdentifier);

        if (existingIndex !== -1) {
            // Unselect player
            const newPlayers = [...selectedPlayers];
            const newNames = [...selectedPlayerNames];
            newPlayers.splice(existingIndex, 1);
            newNames.splice(existingIndex, 1);
            setSelectedPlayers(newPlayers);
            setSelectedPlayerNames(newNames);
            fetchPlayerStats(newPlayers);
            return;
        }

        // Select player
        if (selectedPlayers.length < 4) {
            const newPlayer = { id: playerId, name: playerName, season };
            const updatedPlayers = [...selectedPlayers, newPlayer];
            const updatedNames = [...selectedPlayerNames, playerIdentifier];
            setSelectedPlayers(updatedPlayers);
            setSelectedPlayerNames(updatedNames);
            fetchPlayerStats(updatedPlayers);
        } else {
            const newPlayer = { id: playerId, name: playerName, season };
            const updatedPlayers = [...selectedPlayers.slice(1), newPlayer];
            const updatedNames = [...selectedPlayerNames.slice(1), playerIdentifier];
            setSelectedPlayers(updatedPlayers);
            setSelectedPlayerNames(updatedNames);
            fetchPlayerStats(updatedPlayers);
        }
    };

    const handleToggleActive = (team, playerName) => {
        if (team === team1Name) {
            setTeam1Players(prev => prev.map((player) =>
                player.name === playerName ? { ...player, active: !player.active } : player
            ));
        } else {
            setTeam2Players(prev => prev.map((player) =>
                player.name === playerName ? { ...player, active: !player.active } : player
            ));
        }
    };

    const handleRemovePlayer = (team, playerName) => {
        if (team === team1Name) {
            setTeam1Players(prev => prev.filter((player) => player.name !== playerName));
        } else {
            setTeam2Players(prev => prev.filter((player) => player.name !== playerName));
        }
    };

    const handleSwitchTeams = () => {
        const tempName = team1Name;
        setTeam1Name(team2Name);
        setTeam2Name(tempName);

        const tempPlayers = team1Players;
        setTeam1Players(team2Players);
        setTeam2Players(tempPlayers);
    };

    const handleTeam1Change = (newTeamName) => {
        setTeam1Name(newTeamName);
        const selectedTeam = presetTeams.find((team) => team.name === newTeamName);
        setTeam1Players([...selectedTeam.players]); // Create a new array to ensure state updates
    };

    const handleTeam2Change = (newTeamName) => {
        setTeam2Name(newTeamName);
        const selectedTeam = presetTeams.find((team) => team.name === newTeamName);
        setTeam2Players([...selectedTeam.players]); // Create a new array to ensure state updates
    };

    const handlePlayerSelect = (event, newValue) => {
        setSelectedPlayer(newValue);
        if (newValue) {
            setSelectedSeason(newValue.seasons[0]); // Default to first season
        } else {
            setSelectedSeason("");
        }
    };

    const handleAddPlayer = () => {
        if (selectedPlayer && selectedSeason) {
            const newPlayer = {
                id: selectedPlayer.id,
                name: selectedPlayer.name,
                season: selectedSeason,
                active: true
            };
            
            if (selectedTeam === "team1") {
                setTeam1Players(prev => [...prev, newPlayer]);
            } else {
                setTeam2Players(prev => [...prev, newPlayer]);
            }
            
            // Reset selections
            setSelectedPlayer(null);
            setSelectedSeason("");
            setInputValue("");
        }
    };

    // Calculate maxZScore for layout decision
    const getMaxZScore = () => {
        const validPlayers = playerStats.filter((p) => {
            if (!p || !p.stats || !p.playerName || !p.season) return false;
            const playerIdentifier = `${p.playerName} (${p.season})`;
            return selectedPlayerNames.includes(playerIdentifier);
        });
        if (validPlayers.length === 0) return 2;
        const max = Math.max(
            ...validPlayers.map((player) =>
                Math.max(
                    ...[
                        player.stats.points_z || 0,
                        player.stats.three_pointers_z || 0,
                        player.stats.assists_z || 0,
                        player.stats.steals_z || 0,
                        player.stats.free_throw_percentage_z || 0,
                        player.stats.field_goal_percentage_z || 0,
                        player.stats.turnovers_z || 0,
                        player.stats.blocks_z || 0,
                        player.stats.rebounds_z || 0,
                    ].map((val) => Math.abs(val))
                )
            ),
            2
        );
        return max;
    };

    const maxZScore = getMaxZScore();
    const baseOuterRadius = 70;
    const targetRadius = maxZScore <= 4 ? baseOuterRadius : baseOuterRadius * (maxZScore / 4);
    const maxRadius = 120;
    const cappedRadius = Math.min(targetRadius, maxRadius);

    return (
        <Box sx={{ p: 2, minHeight: "100vh", background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)", color: "#e0e0e0" }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#4a90e2",
                    fontFamily: '"Roboto Mono", monospace',
                }}
            >
                All-Time Statistics
            </Typography>


            <Box sx={{ mb: 4, p: 2, bgcolor: "#252525", borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={allPlayers}
                            getOptionLabel={(option) => option.name}
                            value={selectedPlayer}
                            onChange={handlePlayerSelect}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                            }}
                            filterOptions={(options, { inputValue }) => {
                                if (!inputValue) return options;
                                
                                const searchTerm = inputValue.toLowerCase().trim();
                                return options.filter(option => {
                                    const playerName = option.name.toLowerCase();
                                    return playerName.includes(searchTerm);
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Player"
                                    variant="outlined"
                                    sx={{
                                        bgcolor: "#252525",
                                        color: "#e0e0e0",
                                        "& .MuiOutlinedInput-root": {
                                            color: "#e0e0e0",
                                            "& fieldset": {
                                                borderColor: "#4a90e2",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#80deea",
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#b0bec5",
                                        },
                                    }}
                                />
                            )}
                            PaperComponent={({ children }) => (
                                <Paper sx={{ bgcolor: "#252525", color: "#e0e0e0" }}>
                                    {children}
                                </Paper>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel 
                                sx={{ 
                                    color: "#b0bec5",
                                    "&.Mui-focused": {
                                        color: "#4a90e2",
                                    },
                                }}
                            >
                                Season
                            </InputLabel>
                            <Select
                                value={selectedSeason}
                                onChange={(e) => setSelectedSeason(e.target.value)}
                                disabled={!selectedPlayer}
                                label="Season"
                                sx={{
                                    bgcolor: "#252525",
                                    color: "#e0e0e0",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#4a90e2",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#80deea",
                                    },
                                    "& .MuiSelect-icon": {
                                        color: "#4a90e2",
                                    },
                                    "&.Mui-disabled": {
                                        color: "#666666",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#666666",
                                        },
                                    },
                                }}
                            >
                                {selectedPlayer?.seasons.map((season) => (
                                    <MenuItem key={season} value={season}>
                                        {season}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel 
                                sx={{ 
                                    color: "#b0bec5",
                                    "&.Mui-focused": {
                                        color: "#4a90e2",
                                    },
                                }}
                            >
                                Team
                            </InputLabel>
                            <Select
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                                label="Team"
                                sx={{
                                    bgcolor: "#252525",
                                    color: "#e0e0e0",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#4a90e2",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#80deea",
                                    },
                                    "& .MuiSelect-icon": {
                                        color: "#4a90e2",
                                    },
                                }}
                            >
                                <MenuItem value="team1">{team1Name}</MenuItem>
                                <MenuItem value="team2">{team2Name}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            variant="contained"
                            onClick={handleAddPlayer}
                            disabled={!selectedPlayer || !selectedSeason}
                            startIcon={<AddIcon />}
                            fullWidth
                            sx={{
                                bgcolor: "#4a90e2",
                                "&:hover": {
                                    bgcolor: "#80deea",
                                },
                                height: "56px",
                                "&.Mui-disabled": {
                                    bgcolor: "#666666",
                                    color: "#999999",
                                },
                            }}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Box>


            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={5}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel
                            sx={{
                                color: "#b0bec5",
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: "0.875rem",
                            }}
                        >
                            Team 1
                        </InputLabel>
                        <Select
                            value={team1Name}
                            onChange={(e) => handleTeam1Change(e.target.value)}
                            label="Team 1"
                            sx={{
                                bgcolor: "#252525",
                                color: "#e0e0e0",
                                borderRadius: 1,
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: "0.875rem",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4a90e2" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#80deea" },
                                "& .MuiSelect-icon": { color: "#4a90e2" },
                            }}
                        >
                            {presetTeams.map((team) => (
                                <MenuItem
                                    key={team.name}
                                    value={team.name}
                                    disabled={team.name === team2Name}
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontSize: "0.875rem",
                                        "&.Mui-disabled": { opacity: 0.5 },
                                    }}
                                >
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton
                        onClick={handleSwitchTeams}
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
                <Grid item xs={5}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel
                            sx={{
                                color: "#b0bec5",
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: "0.875rem",
                            }}
                        >
                            Team 2
                        </InputLabel>
                        <Select
                            value={team2Name}
                            onChange={(e) => handleTeam2Change(e.target.value)}
                            label="Team 2"
                            sx={{
                                bgcolor: "#252525",
                                color: "#e0e0e0",
                                borderRadius: 1,
                                fontFamily: '"Roboto Mono", monospace',
                                fontSize: "0.875rem",
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4a90e2" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#80deea" },
                                "& .MuiSelect-icon": { color: "#4a90e2" },
                            }}
                        >
                            {presetTeams.map((team) => (
                                <MenuItem
                                    key={team.name}
                                    value={team.name}
                                    disabled={team.name === team1Name}
                                    sx={{
                                        fontFamily: '"Roboto Mono", monospace',
                                        fontSize: "0.875rem",
                                        "&.Mui-disabled": { opacity: 0.5 },
                                    }}
                                >
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                color: "#4a90e2",
                                fontFamily: '"Roboto Mono", monospace',
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                            }}
                        >
                            {team1Name} Roster
                        </Typography>
                        <List
                            sx={{
                                bgcolor: "#252525",
                                borderRadius: 1,
                                p: 1,
                                maxHeight: 300,
                                overflow: "auto",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "#1e1e1e",
                                    borderRadius: "3px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "#4a90e2",
                                    borderRadius: "3px",
                                },
                            }}
                        >
                            {team1Players.map((player, index) => (
                                <ListItem
                                    key={`${player.id}-${index}`}
                                    sx={{
                                        py: 0.5,
                                        px: 1,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        bgcolor: player.active ? "rgba(74, 144, 226, 0.1)" : "rgba(158, 158, 158, 0.1)",
                                        border: `1px solid ${player.active ? "rgba(74, 144, 226, 0.2)" : "rgba(158, 158, 158, 0.2)"}`,
                                        "&:hover": {
                                            bgcolor: player.active ? "rgba(74, 144, 226, 0.15)" : "rgba(158, 158, 158, 0.15)",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={`${player.name} (${player.season})`}
                                        primaryTypographyProps={{
                                            fontFamily: '"Roboto Mono", monospace',
                                            color: "#e0e0e0",
                                        }}
                                    />
                                    <Tooltip title={player.active ? "Disable Player" : "Enable Player"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="toggle active"
                                            onClick={() => handleToggleActive(team1Name, player.name)}
                                            size="small"
                                            sx={{
                                                color: player.active ? "#4a90e2" : "#b0bec5",
                                                "&:hover": { bgcolor: "rgba(74, 144, 226, 0.2)" },
                                            }}
                                        >
                                            {player.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={selectedPlayerNames.includes(`${player.name} (${player.season})`) ? "Remove from Comparison" : "Add to Comparison"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="compare"
                                            onClick={() => handleAddToComparison(player.name, player.season, player.id)}
                                            size="small"
                                            sx={{
                                                color: selectedPlayerNames.includes(`${player.name} (${player.season})`)
                                                    ? "#4a90e2"
                                                    : "#4CAF50",
                                                bgcolor: selectedPlayerNames.includes(`${player.name} (${player.season})`)
                                                    ? "rgba(74, 144, 226, 0.2)"
                                                    : "transparent",
                                                "&:hover": {
                                                    bgcolor: selectedPlayerNames.includes(`${player.name} (${player.season})`)
                                                        ? "rgba(74, 144, 226, 0.3)"
                                                        : "rgba(76, 175, 80, 0.2)",
                                                },
                                            }}
                                        >
                                            <RadarIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove Player" arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemovePlayer(team1Name, player.name)}
                                            size="small"
                                            sx={{
                                                color: "#ff6f61",
                                                "&:hover": { bgcolor: "rgba(255, 111, 97, 0.2)" },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                color: "#4a90e2",
                                fontFamily: '"Roboto Mono", monospace',
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                            }}
                        >
                            {team2Name} Roster
                        </Typography>
                        <List
                            sx={{
                                bgcolor: "#252525",
                                borderRadius: 1,
                                p: 1,
                                maxHeight: 300,
                                overflow: "auto",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "#1e1e1e",
                                    borderRadius: "3px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "#4a90e2",
                                    borderRadius: "3px",
                                },
                            }}
                        >
                            {team2Players.map((player, index) => (
                                <ListItem
                                    key={`${player.id}-${index}`}
                                    sx={{
                                        py: 0.5,
                                        px: 1,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        bgcolor: player.active ? "rgba(74, 144, 226, 0.1)" : "rgba(158, 158, 158, 0.1)",
                                        border: `1px solid ${player.active ? "rgba(74, 144, 226, 0.2)" : "rgba(158, 158, 158, 0.2)"}`,
                                        "&:hover": {
                                            bgcolor: player.active ? "rgba(74, 144, 226, 0.15)" : "rgba(158, 158, 158, 0.15)",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={`${player.name} (${player.season})`}
                                        primaryTypographyProps={{
                                            fontFamily: '"Roboto Mono", monospace',
                                            color: "#e0e0e0",
                                        }}
                                    />
                                    <Tooltip title={player.active ? "Disable Player" : "Enable Player"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="toggle active"
                                            onClick={() => handleToggleActive(team2Name, player.name)}
                                            size="small"
                                            sx={{
                                                color: player.active ? "#4a90e2" : "#b0bec5",
                                                "&:hover": { bgcolor: "rgba(74, 144, 226, 0.2)" },
                                            }}
                                        >
                                            {player.active ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={selectedPlayerNames.includes(`${player.name} (${player.season})`) ? "Remove from Comparison" : "Add to Comparison"} arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="compare"
                                            onClick={() => handleAddToComparison(player.name, player.season, player.id)}
                                            size="small"
                                            sx={{
                                                color: selectedPlayerNames.includes(`${player.name} (${player.season})`)
                                                    ? "#4a90e2"
                                                    : "#4CAF50",
                                                bgcolor: selectedPlayerNames.includes(`${player.name} (${player.season})`)
                                                    ? "rgba(74, 144, 226, 0.2)"
                                                    : "transparent",
                                                "&:hover": {
                                                    bgcolor: selectedPlayerNames.includes(`${player.name} (${player.season})`)
                                                        ? "rgba(74, 144, 226, 0.3)"
                                                        : "rgba(76, 175, 80, 0.2)",
                                                },
                                            }}
                                        >
                                            <RadarIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Remove Player" arrow>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemovePlayer(team2Name, player.name)}
                                            size="small"
                                            sx={{
                                                color: "#ff6f61",
                                                "&:hover": { bgcolor: "rgba(255, 111, 97, 0.2)" },
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <StatsComparisonGraph
                        teamAverages={playerStats.find((p) => p.teamAverages)?.teamAverages || null}
                        team1Name={team1Name}
                        team2Name={team2Name}
                    />
                </Grid>
                <Grid item xs={12} md={cappedRadius > 90 ? 12 : 6}>
                    <PlayerComparisonGraph
                        players={playerStats}
                        playerNames={selectedPlayerNames}
                        onClearPlayers={() => {
                            setSelectedPlayers([]);
                            setSelectedPlayerNames([]);
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Alltime;