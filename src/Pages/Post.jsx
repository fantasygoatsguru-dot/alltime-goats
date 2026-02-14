import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../sanity/client";
import { fetchAffiliateLinks, recordAffiliateClick } from "../api";

import {
  Box,
  Typography,
  CircularProgress,
  Link,
  useTheme,
  useMediaQuery,
  Container,
  Button,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlBuilder = imageUrlBuilder({ projectId, dataset });
const urlFor = (source) => urlBuilder.image(source);

/* ---------------- HIGH-CONVERSION AFFILIATE CARD ---------------- */
function AffiliateInlineCard({ item }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!item) return null;

  const handleClick = () => {
    recordAffiliateClick(item.id);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "affiliate_inline_click",
      affiliate_id: item.id,
      affiliate_url: item.url,
      affiliate_label: item.label,
    });
  };

  return (
    <Box
      component="a"
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      sx={{
        my: 5,
        p: 2.2,
        borderRadius: 2,
        bgcolor: "#fff",
        border: "1px solid #e6e6e6",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        maxWidth: 350,
        mx: "auto",
        display: "block",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        transition: "all .15s ease",

        "&:hover": {
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          transform: "translateY(-1px)",
          borderColor: "#dcdcdc",
        },

        "&:active": {
          transform: "translateY(0px)",
          boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: "#1976d2",
          letterSpacing: 0.4,
          mb: 1.3,
          display: "block",
        }}
      >
        RECOMMENDED GEAR
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        {item.thumbnail_url && (
          <Box
            component="img"
            src={item.thumbnail_url}
            alt={item.label}
            sx={{
              width: isMobile ? 140 : 150,
              height: "auto",
              maxHeight: isMobile ? 140 : 130,
              objectFit: "contain",
              display: "block",
            }}
          />
        )}

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: "#222",
            }}
          >
            {item.label}
          </Typography>

          {/* Button stays for visual CTA but doesn't duplicate analytics */}
          <Button
            variant="contained"
            sx={{
              mt: 1,
              bgcolor: "#f7ca00",
              color: "#111",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 1.5,
              px: 2.8,
              py: 1,
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              pointerEvents: "none",   // ← prevents nested-click issues
              "&:hover": {
                bgcolor: "#f2c200",
              },
            }}
          >
            View on Amazon
          </Button>
        </Box>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: 1.3,
          display: "block",
          fontSize: "0.72rem",
        }}
      >
        As an Amazon Associate, we earn from qualifying purchases.
      </Typography>
    </Box>
  );
}

/* ---------------- PORTABLE TEXT ---------------- */

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <Box
          component="img"
          src={urlFor(value).width(800).fit("max").auto("format").url()}
          alt={value.alt || "Post image"}
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 2,
            my: 4,
            display: "block",
            boxShadow: 2,
          }}
        />
      );
    },
  },

  block: {
    blockquote: ({ children }) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: "5px solid #1976d2",
          pl: 3,
          py: 1,
          my: 4,
          bgcolor: "rgba(25,118,210,0.05)",
          borderRadius: "0 8px 8px 0",
          fontStyle: "italic",
          color: "#333",
        }}
      >
        {children}
      </Box>
    ),
  },
};

/* ---------------- MAIN ---------------- */

export default function Post() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [affiliate, setAffiliate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [postData, affiliateData] = await Promise.all([
          client.fetch(POST_QUERY, { slug }),
          fetchAffiliateLinks(),
        ]);

        if (!postData) setError("Post not found.");
        else setPost(postData);

        if (affiliateData?.length) {
          const random =
            affiliateData[Math.floor(Math.random() * affiliateData.length)];
          setAffiliate(random);
        }
      } catch (err) {
        setError("Failed to fetch post. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography sx={{ mb: 3, p: 2, bgcolor: "#ffebee", borderRadius: 1, color: "#b71c1c" }}>
          {error || "Post not found."}
        </Typography>

        <Link component={RouterLink} to="/posts" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
          <ArrowBackIcon /> Back to Posts
        </Link>
      </Container>
    );
  }

  const postImageUrl = post.image
    ? urlFor(post.image).width(1200).height(600).url()
    : null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link
        component={RouterLink}
        to="/posts"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          color: "#1976d2",
          textDecoration: "none",
          mb: 4,
          fontWeight: 600,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
        Back to Posts
      </Link>

      {postImageUrl && (
        <Box
          component="img"
          src={postImageUrl}
          alt={post.title}
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 3,
            mb: 4,
            maxHeight: "500px",
            objectFit: "cover",
            display: "block",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        />
      )}

      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          sx={{ mb: 2, fontWeight: 800, color: "#222" }}
        >
          {post.title}
        </Typography>

        <Typography variant="subtitle1" sx={{ color: "#666" }}>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
      </Box>

      <Box
        sx={{
          mx: "auto",
          "& p": {
            lineHeight: 1.8,
            fontSize: "1.15rem",
            color: "#333",
            mb: 3,
          },
          "& h2, & h3": {
            mt: 5,
            mb: 2.5,
            fontWeight: 700,
            color: "#111",
          },
          "& img": { mx: "auto" },
        }}
      >
        {Array.isArray(post.body) &&
          post.body.map((block, i) => (
            <React.Fragment key={block._key || i}>
              <PortableText value={[block]} components={ptComponents} />

              {i === 1 && affiliate && (
                <AffiliateInlineCard item={affiliate} />
              )}
            </React.Fragment>
          ))}
      </Box>
    </Container>
  );
}
