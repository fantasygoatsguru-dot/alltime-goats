import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Link, Button } from "@mui/material";

// Google's CMP exposes a "reopen the consent message" entry point once it has
// loaded. It only exists where a message actually applies (EEA/UK, US states),
// so the button is rendered only when it does — a dead "manage preferences"
// button is worse than none.
const useConsentRevocation = () => {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let waited = 0;
    const timer = setInterval(() => {
      if (typeof window.googlefc?.showRevocationMessage === "function") {
        setAvailable(true);
        clearInterval(timer);
      } else if ((waited += 250) >= 5000) {
        clearInterval(timer);
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);

  return {
    available,
    reopen: () => window.googlefc?.showRevocationMessage?.(),
  };
};

const PrivacyPolicy = () => {
  const consent = useConsentRevocation();

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 6, 
        backgroundColor: "#121212", // Slightly softer than #121212 for better readability
        minHeight: "100vh",
        lineHeight: 1.6
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: "#ffffff" }}>
        Privacy Policy
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "#ffffff" }}>
        Effective Date: August 20, 2026
      </Typography>

      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        Welcome to Fantasy Goats Guru ("we," "our," or "us"), a fantasy basketball analytics site accessible at{" "}
        <Link href="https://fantasygoats.guru" color="secondary" underline="hover">
          fantasygoats.guru
        </Link>
        . This Privacy Policy explains how we collect, use, and protect your information when you visit our site.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        1. Information We Collect
      </Typography>
      <Typography variant="body1" component="div" sx={{ color: "#ffffff" }}>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <strong>Usage data</strong>: pages viewed, time spent, referring site, approximate location, device and browser type.
          </li>
          <li>
            <strong>Session recordings and heatmaps</strong>: where consent allows, we record how pages are used — clicks, scrolling and mouse movement — to find parts of the site that are confusing or broken. Recordings capture interaction, not the contents of password fields.
          </li>
          <li>
            <strong>Account information</strong>: if you create an account, your email address and the sign-in method you chose (Google, or an emailed magic link).
          </li>
          <li>
            <strong>Fantasy league data</strong>: if you connect Yahoo Fantasy, we receive your league, team and roster information from Yahoo in order to run the tools you asked for.
          </li>
          <li>
            <strong>Purchase records</strong>: if you buy a pass, we store which pass you own and for which season. Card details are handled entirely by our payment processor and never reach our servers.
          </li>
        </Box>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        2. How We Use Your Information
      </Typography>
      <Typography variant="body1" component="div" sx={{ color: "#ffffff" }}>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>Run the analytics tools you request, on the league data you connect.</li>
          <li>Analyze site usage to improve content and user experience.</li>
          <li>Deliver and, where consent allows, personalize advertising on the free tier.</li>
          <li>Recognize you across visits and grant access to any pass you have purchased.</li>
          <li>Send email you have asked for, and keep the site functioning securely.</li>
        </Box>
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff", mt: 2 }}>
        We do not sell your personal information.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        3. Third-Party Services
      </Typography>
      <Typography variant="body1" component="div" sx={{ color: "#ffffff" }}>
        We use the following providers, each under its own privacy policy:
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <strong>Google Analytics and Google Tag Manager</strong> — site analytics.{" "}
            <Link href="https://policies.google.com/privacy" color="secondary" underline="hover">
              Google Privacy Policy
            </Link>.
          </li>
          <li>
            <strong>Google AdSense</strong> — advertising on the free tier, together with Google's Privacy &amp; Messaging consent tool.{" "}
            <Link href="https://policies.google.com/technologies/partner-sites" color="secondary" underline="hover">
              How Google uses data from sites that use its services
            </Link>.
          </li>
          <li>
            <strong>Microsoft Clarity</strong> — session recordings and heatmaps.{" "}
            <Link href="https://privacy.microsoft.com/privacystatement" color="secondary" underline="hover">
              Microsoft Privacy Statement
            </Link>.
          </li>
          <li>
            <strong>Yahoo Fantasy Sports</strong> — only if you choose to connect it, to read your league data.{" "}
            <Link href="https://legal.yahoo.com/us/en/yahoo/privacy/index.html" color="secondary" underline="hover">
              Yahoo Privacy Policy
            </Link>.
          </li>
          <li>
            <strong>Supabase</strong> — hosting for accounts and stored data.
          </li>
          <li>
            <strong>Polar</strong> — payment processing for passes.
          </li>
        </Box>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        4. Cookies and Your Choices
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        We use cookies and similar technologies for sign-in, analytics and advertising. Where the law requires it — including the EEA, the UK, Switzerland and several US states — a consent message appears on your first visit, and analytics, session recording and personalized advertising stay switched off until you answer it. Elsewhere they are enabled by default and you can opt out using the controls below.
      </Typography>
      {consent.available && (
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" color="secondary" onClick={consent.reopen}>
            Manage cookie preferences
          </Button>
        </Box>
      )}
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        You can also manage cookies in your browser settings, opt out of personalized Google advertising at{" "}
        <Link href="https://adssettings.google.com" color="secondary" underline="hover">
          Google Ads Settings
        </Link>
        , or opt out of third-party vendors' advertising cookies at{" "}
        <Link href="https://www.aboutads.info" color="secondary" underline="hover">
          aboutads.info
        </Link>
        . Disconnecting Yahoo from your profile stops us receiving any further league data.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        5. Data Security
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        We use reasonable measures (e.g., HTTPS encryption) to protect your data, but no method is 100% secure.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        6. Your Rights
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        Depending on your location (e.g., the EU or UK under GDPR, or California under the CCPA), you may have rights to access, correct, delete, or opt out of the collection of your data, and to withdraw consent at any time. Contact us at{" "}
        <Link href="mailto:fantasygoatsguru@gmail.com" color="secondary" underline="hover">
          fantasygoatsguru@gmail.com
        </Link>{" "}
        to exercise these rights, and we will respond within the time your local law allows.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        7. Children's Privacy
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        This site is not directed at children under 13, and we do not knowingly collect their personal information. If you believe a child has provided us data, contact us and we will delete it.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        8. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        We may update this Privacy Policy. Changes will be posted here with an updated effective date.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        9. Contact Us
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        For questions, contact us at{" "}
        <Link href="mailto:fantasygoatsguru@gmail.com" color="secondary" underline="hover">
          fantasygoatsguru@gmail.com
        </Link>
        .
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
