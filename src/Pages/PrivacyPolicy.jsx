import React from "react";
import { Container, Typography, Box, Link } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, color: "text.primary", backgroundColor: "#121212", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        Effective Date: October 25, 2025
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to Fantasy Goats ("we," "our," or "us"), a website dedicated to NBA fantasy basketball historical stats, accessible at{" "}
        <Link href="https://fantasygoats.guru" color="primary" underline="hover">
          fantasygoats.guru
        </Link>
        . This Privacy Policy explains how we collect, use, and protect your information when you visit our site.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Information We Collect
      </Typography>
      <Typography variant="body1" paragraph>
        We collect the following types of information:
        <ul>
          <li>
            <strong>Non-Personal Information</strong>: We use third-party services like Google Analytics and Google Tag Manager to collect anonymized data about your visit, such as pages viewed, time spent, and device type. This helps us improve the site.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies</strong>: Our advertising partner, Ezoic, uses cookies and similar technologies to serve personalized ads based on your interests. These may track your browsing behavior across sites for ad targeting.
          </li>
        </ul>
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. How We Use Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        We use the collected data to:
        <ul>
          <li>Analyze site usage to enhance content and user experience.</li>
          <li>Deliver relevant advertisements through Ezoic.</li>
          <li>Ensure the site functions properly and securely.</li>
        </ul>
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Third-Party Services
      </Typography>
      <Typography variant="body1" paragraph>
        We partner with:
        <ul>
          <li>
            <strong>Ezoic</strong>: For ad monetization, which may use cookies for personalized ads. See Ezoic’s{" "}
            <Link href="https://www.ezoic.com/privacy-policy/" color="primary" underline="hover">
              Privacy Policy
            </Link>
            .
          </li>
          <li>
            <strong>Google Analytics and Google Tag Manager</strong>: For site analytics. See Google’s{" "}
            <Link href="https://policies.google.com/privacy" color="primary" underline="hover">
              Privacy Policy
            </Link>
            .
          </li>
        </ul>
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Cookies and Your Choices
      </Typography>
      <Typography variant="body1" paragraph>
        Our site uses a cookie consent popup (powered by Ezoic’s Gatekeeper Consent) to let you manage cookie preferences. You can accept or decline non-essential cookies. You can also manage cookies via your browser settings.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        We use reasonable measures (e.g., HTTPS encryption) to protect your data, but no method is 100% secure.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Your Rights
      </Typography>
      <Typography variant="body1" paragraph>
        Depending on your location (e.g., EU under GDPR or California under CCPA), you may have rights to access, delete, or opt out of data collection. Contact us at [insert your email] to exercise these rights.
      </Typography>

      <Typography variant="h6" gutterBottom>
        7. Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy. Changes will be posted here with an updated effective date.
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        For questions, contact us at [insert your email or form link].
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;