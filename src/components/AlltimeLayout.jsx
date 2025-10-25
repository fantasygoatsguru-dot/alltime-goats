import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Alltime from '../Pages/Alltime';
import AlltimeTable from '../Pages/AlltimeTable';
import AlltimeGames from '../Pages/AlltimeGames';

const AlltimeLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (location.pathname === '/seasons' || location.pathname === '/table') {
            setTabValue(1);
        } else if (location.pathname === '/games') {
            setTabValue(2);
        } else if (location.pathname === '/teams' || location.pathname === '/charts') {
            setTabValue(0);
        } 
        else {
            setTabValue(1);
        }
    }, [location.pathname]);

    const handleTabChange = (_, newValue) => {
        setTabValue(newValue);
        switch (newValue) {
            case 0:
                navigate('/teams');
                break;
            case 1:
                navigate('/seasons');
                break;
            case 2:
                navigate('/games');
                break;
            default:
                navigate('/teams');
        }
    };

    const renderContent = () => {
        switch (tabValue) {
            case 1:
                return <AlltimeTable />;
            case 2:
                return <AlltimeGames />;
            default:
                return <Alltime />;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
                color: "#e0e0e0",
                '@media (maxWidth: 600px)': {
                    padding: '8px'
                }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                    }}
                >
                    <img 
                        src="https://www.svgrepo.com/show/396571/goat.svg" 
                        alt="GOAT" 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            filter: 'invert(1)',
                        }} 
                    />
                    <Typography 
                        variant="h5" 
                        component="h1"
                        sx={{ 
                            fontSize: { xs: "1rem", sm: "1.5rem" }, 
                            fontWeight: 600, 
                            color: "#e0e0e0" 
                        }}
                    >
                        Fantasy Goats Guru
                    </Typography>
                </Box>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{ 
                        minWidth: 'fit-content',
                        marginLeft: 'auto',
                        '& .MuiTab-root': {
                            minWidth: { xs: 40, sm: 100 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            padding: { xs: '6px 8px', sm: '12px 16px' },
                            color: '#e0e0e0',
                            '&.Mui-selected': {
                                color: '#4a90e2',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#4a90e2',
                        },
                    }}
                >
                    <Tab label="Teams" />
                    <Tab label="Seasons" />
                    <Tab label="Games" />
                </Tabs>
            </Box>
            <Container maxWidth={false} disableGutters>
                {renderContent()}
            </Container>
        </Box>
    );
};

export default AlltimeLayout;