import React from "react";
import { Container, Typography, Box, Link } from "@mui/material";

const Terms = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
        backgroundColor: "#121212",
        minHeight: "100vh",
        lineHeight: 1.6,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#ffffff" }}>
        Terms of Service
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "#ffffff" }}>
        Effective Date: July 21, 2026
      </Typography>

      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        These Terms of Service ("Terms") govern your use of Fantasy Goats ("we," "our," or "us")
        and the tools, statistics, and content available at{" "}
        <Link href="https://fantasygoats.guru" color="secondary" underline="hover">
          fantasygoats.guru
        </Link>{" "}
        (the "Service"). By accessing or using the Service, you agree to these Terms. If you do not
        agree, please do not use the Service.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        1. Use of the Service
      </Typography>
      <Typography variant="body1" component="div" sx={{ color: "#ffffff" }}>
        You may use the Service for personal, non-commercial fantasy basketball research and
        entertainment. You agree not to:
        <Box component="ul" sx={{ pl: 2 }}>
          <li>Scrape, resell, or redistribute our data or content in bulk.</li>
          <li>Attempt to disrupt, overload, or gain unauthorized access to the Service.</li>
          <li>Use the Service in any way that violates applicable laws or third-party rights.</li>
        </Box>
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        2. Accounts and Yahoo Connection
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        Some features let you sign in and optionally connect your Yahoo Fantasy account to load your
        league data. You are responsible for activity under your account and for keeping your login
        secure. Connecting Yahoo is optional; when you do, you authorize us to access the league,
        roster, and matchup data needed to power those tools. You can disconnect at any time. Your
        use of Yahoo is also subject to Yahoo's own terms.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        3. No Warranty on Statistics
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        The Service provides statistics, rankings, and projections for informational purposes only.
        Data may contain errors or delays, and projections are estimates, not guarantees. We make no
        warranty as to the accuracy, completeness, or timeliness of any content, and you use it at
        your own risk. Nothing here is betting or financial advice.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        4. Affiliate Links
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        The Service contains affiliate links, including through the Amazon Services LLC Associates
        Program. We may earn a commission from qualifying purchases at no additional cost to you.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        5. Intellectual Property
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        The Service, including its design, tools, and original content, is owned by us and protected
        by applicable laws. Player names, team names, and league data belong to their respective
        owners; we are not affiliated with or endorsed by the NBA or Yahoo.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        6. Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        To the maximum extent permitted by law, the Service is provided "as is" and "as available,"
        without warranties of any kind. We are not liable for any indirect, incidental, or
        consequential damages arising from your use of, or inability to use, the Service.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        7. Changes to These Terms
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        We may update these Terms from time to time. Changes will be posted here with an updated
        effective date, and your continued use of the Service constitutes acceptance of the revised
        Terms.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
        8. Contact Us
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#ffffff" }}>
        Questions about these Terms? Contact us at <strong>[insert your email or form link]</strong>.
      </Typography>

      <Typography variant="body2" sx={{ mt: 4, color: "#bbbbbb" }}>
        See also our{" "}
        <Link component="a" href="/privacy-policy" color="secondary" underline="hover">
          Privacy Policy
        </Link>
        .
      </Typography>
    </Container>
  );
};

export default Terms;
