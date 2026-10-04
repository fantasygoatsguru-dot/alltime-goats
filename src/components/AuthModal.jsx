import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../contexts/AuthContext";
import { YAHOO_ENABLED } from '../config/yahoo';

// Account sign-in surface (Supabase Auth). This is the "who you are" layer that
// owns entitlements — separate from the Yahoo "connect your league" integration.
const AuthModal = ({ open, onClose }) => {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message || "Could not start Google sign-in.");
      setGoogleLoading(false);
    }
    // On success the browser redirects to Google, so no further state needed.
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setEmailLoading(true);
    const { error } = await signInWithEmail(trimmed);
    setEmailLoading(false);
    if (error) {
      setError(error.message || "Could not send the magic link.");
      return;
    }
    setSent(true);
  };

  const handleClose = () => {
    setError("");
    setSent(false);
    setEmailLoading(false);
    setGoogleLoading(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1, pr: 1 }}>
        <IconButton onClick={handleClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ pt: 0, pb: 4, px: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, textAlign: "center", mb: 0.5, color: "#4a90e2" }}>
          Sign in
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", mb: 3 }}>
          Your Fantasy Goats Guru account.{YAHOO_ENABLED && " Connect Yahoo separately once you're in."}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {sent ? (
          <Alert severity="success">
            Check <strong>{email.trim()}</strong> for a magic link to finish signing in.
          </Alert>
        ) : (
          <>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogle}
              disabled={googleLoading}
              startIcon={googleLoading ? <CircularProgress size={18} /> : <GoogleIcon />}
              sx={{ py: 1.2, mb: 2.5, borderColor: "#dadce0", color: "#3c4043", fontWeight: 600 }}
            >
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </Button>

            <Divider sx={{ mb: 2.5, color: "text.disabled", fontSize: "0.8rem" }}>or</Divider>

            <Box component="form" onSubmit={handleEmail}>
              <TextField
                fullWidth
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={emailLoading}
                startIcon={emailLoading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{ py: 1.2, bgcolor: "#4a90e2", fontWeight: 600 }}
              >
                {emailLoading ? "Sending…" : "Send magic link"}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
