import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Alert,
    CircularProgress,
    Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

const UserProfile = () => {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        send_weekly_projections: true,
        send_news: true,
        is_premium: false,
    });

    useEffect(() => {
        if (isAuthenticated && user?.userId) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.userId)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                // PGRST116 is "no rows returned" - this is OK for new users
                throw profileError;
            }

            if (profile) {
                setProfileData({
                    name: profile.name || '',
                    email: profile.email || '',
                    send_weekly_projections: profile.send_weekly_projections ?? true,
                    send_news: profile.send_news ?? true,
                    is_premium: profile.is_premium ?? false,
                });
            } else {
                // New user - get default email from OAuth data (yahoo_tokens)
                const { data: yahooData } = await supabase
                    .from('yahoo_tokens')
                    .select('email, name')
                    .eq('user_id', user.userId)
                    .single();

                if (yahooData) {
                    setProfileData(prev => ({
                        ...prev,
                        name: yahooData.name || user.name || '',
                        email: yahooData.email || user.email || '',
                    }));
                }
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.userId) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            // Check if profile exists
            const { data: existing } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('user_id', user.userId)
                .single();

            const profileToSave = {
                user_id: user.userId,
                name: profileData.name,
                email: profileData.email,
                send_weekly_projections: profileData.send_weekly_projections,
                send_news: profileData.send_news,
                // is_premium is read-only, not updated from UI
            };

            if (existing) {
                // Update existing profile
                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update(profileToSave)
                    .eq('user_id', user.userId);

                if (updateError) throw updateError;
            } else {
                // Insert new profile
                const { error: insertError } = await supabase
                    .from('user_profiles')
                    .insert(profileToSave);

                if (insertError) throw insertError;
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Box
                sx={{
                    p: 4,
                    minHeight: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Alert severity="info">
                    Please log in with Yahoo to access your profile.
                </Alert>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box
                sx={{
                    p: 4,
                    minHeight: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                minHeight: '50vh',
                maxWidth: '800px',
                margin: '0 auto',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, md: 4 },
                    bgcolor: '#252525',
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#4a90e2',
                        fontFamily: '"Roboto Mono", monospace',
                    }}
                >
                    User Profile
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Profile saved successfully!
                    </Alert>
                )}

                {/* Account Information */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            color: '#e0e0e0',
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Account Information
                    </Typography>

                    <TextField
                        fullWidth
                        label="Name"
                        value={profileData.name}
                        onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                        }
                        sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': {
                                color: '#b0bec5',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: '#e0e0e0',
                                '& fieldset': {
                                    borderColor: '#4a90e2',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#80deea',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                        }
                        sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': {
                                color: '#b0bec5',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: '#e0e0e0',
                                '& fieldset': {
                                    borderColor: '#4a90e2',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#80deea',
                                },
                            },
                        }}
                    />

                    {profileData.is_premium && (
                        <Alert
                            severity="success"
                            sx={{ mb: 2, bgcolor: 'rgba(76, 175, 80, 0.1)' }}
                        >
                            🌟 Premium Account - Enjoy weekly matchup projections!
                        </Alert>
                    )}
                </Box>

                <Divider sx={{ my: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Notification Preferences */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            color: '#e0e0e0',
                            fontFamily: '"Roboto Mono", monospace',
                        }}
                    >
                        Notification Preferences
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={profileData.send_weekly_projections}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        send_weekly_projections: e.target.checked,
                                    })
                                }
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#4a90e2',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#4a90e2',
                                    },
                                }}
                            />
                        }
                        label={
                            <Box>
                                <Typography sx={{ color: '#e0e0e0' }}>
                                    Send Weekly Matchup Projections
                                </Typography>
                            </Box>
                        }
                        sx={{ display: 'block', mb: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={profileData.send_news}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        send_news: e.target.checked,
                                    })
                                }
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#4a90e2',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#4a90e2',
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography sx={{ color: '#e0e0e0' }}>
                                Get News from Fantasy Goats Guru
                            </Typography>
                        }
                        sx={{ display: 'block', mb: 2 }}
                    />
                </Box>

                {/* Save Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        sx={{
                            bgcolor: '#4a90e2',
                            color: '#e0e0e0',
                            fontFamily: '"Roboto Mono", monospace',
                            px: 4,
                            py: 1,
                            '&:hover': {
                                bgcolor: '#80deea',
                            },
                            '&.Mui-disabled': {
                                bgcolor: '#b0bec5',
                                color: '#e0e0e0',
                            },
                        }}
                    >
                        {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserProfile;

