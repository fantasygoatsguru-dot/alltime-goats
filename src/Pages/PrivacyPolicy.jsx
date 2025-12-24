import React from "react";
import { Container, Typography, Box, Link } from "@mui/material";

const PrivacyPolicy = () => {
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
        Effective Date: December 24, 2025
      </Typography>

      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        Welcome to Fantasy Goats ("we," "our," or "us"), a website dedicated to NBA fantasy basketball historical stats, accessible at{" "}
        <Link href="https://fantasygoats.guru" color="secondary" underline="hover">
          fantasygoats.guru
        </Link>
        . This Privacy Policy explains how we collect, use, and protect your information when you visit our site.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        1. Information We Collect
      </Typography>
      <Typography variant="body1" component="div" sx={{ color: "#ffffff" }}>
        We collect the following types of information:
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <strong>Non-Personal Information</strong>: We use third-party services like Google Analytics and Google Tag Manager to collect anonymized data about your visit, such as pages viewed, time spent, and device type.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies</strong>: Our advertising partner, <strong>Google AdSense</strong>, uses cookies to serve ads based on your prior visits to our website or other websites on the Internet.
          </li>
        </Box>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        2. How We Use Your Information
      </Typography>
      <Typography variant="body1" component="div" sx={{ color: "#ffffff" }}>
        We use the collected data to:
        <Box component="ul" sx={{ pl: 2 }}>
          <li>Analyze site usage to enhance content and user experience.</li>
          <li>Deliver relevant advertisements through Google AdSense.</li>
          <li>Ensure the site functions properly and securely.</li>
        </Box>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        3. Third-Party Services
      </Typography>
      <Typography variant="body1" component="div" sx={{ color: "#ffffff" }}>
        We partner with:
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <strong>Google AdSense</strong>: Google uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{" "}
            <Link href="https://www.google.com/settings/ads" color="secondary" target="_blank">
              Ads Settings
            </Link>.
          </li>
          <li>
            <strong>Google Analytics</strong>: For site analytics. See Google’s{" "}
            <Link href="https://policies.google.com/privacy" color="secondary" underline="hover">
              Privacy Policy
            </Link>.
          </li>
        </Box>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        4. Cookies and Your Choices
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        You can choose to decline personalized advertising. You can also manage cookies via your browser settings or visit <Link href="https://www.aboutads.info" color="secondary">www.aboutads.info</Link> to opt out of a third-party vendor's use of cookies for personalized advertising.
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
        Depending on your location (e.g., EU under GDPR or California under CCPA), you may have rights to access, delete, or opt out of data collection. Contact us at <strong>[insert your email]</strong> to exercise these rights.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        7. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        We may update this Privacy Policy. Changes will be posted here with an updated effective date.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        8. Contact Us
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        For questions, contact us at <strong>[insert your email or form link]</strong>.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;